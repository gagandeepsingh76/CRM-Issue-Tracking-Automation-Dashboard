import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import ErrorState from "../components/common/ErrorState";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import TimeSelector from "../components/TimeSelector";
import { useCrmStore } from "../store/crmStore";
import { formatEnum } from "../utils/crmFormat";

const DEFAULT_TIME_RANGE = "1 Week";
const DEFAULT_DASHBOARD_DATA = {
  totalUsers: 0,
  openLeads: 0,
  wonDeals: 0,
  openTickets: 0,
  pieData: [],
  pieLabels: [],
  lineData: [],
  lineLabels: [],
};

const getSeries = (rows = [], key = "label") => ({
  labels: rows.map((row) => formatEnum(row[key])),
  data: rows.map((row) => Number(row.count ?? 0)),
});

const mapDashboardData = (summary = {}) => {
  const metrics = summary.metrics ?? {};
  const ticketPrioritySeries = getSeries(summary.ticketPriorities);
  const dealStageSeries = getSeries(summary.dealStages);

  return {
    totalUsers: Number(metrics.totalUsers ?? 0),
    openLeads: Number(metrics.openLeads ?? 0),
    wonDeals: Number(metrics.wonDeals ?? 0),
    openTickets: Number(metrics.openTickets ?? 0),
    pieData: ticketPrioritySeries.data,
    pieLabels: ticketPrioritySeries.labels,
    lineData: dealStageSeries.data,
    lineLabels: dealStageSeries.labels,
  };
};

const Dashboard = () => {
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME_RANGE);
  const [data, setData] = useState(DEFAULT_DASHBOARD_DATA);
  const dashboard = useCrmStore((state) => state.dashboard);
  const loadDashboardSummary = useCrmStore((state) => state.loadDashboardSummary);
  const isLoading = dashboard.status === "loading";

  const loadDashboardData = async () => {
    const summary = await loadDashboardSummary();
    setData(mapDashboardData(summary));
  };

  const handleTimeSelect = async (timeRange) => {
    setSelectedTime(timeRange);

    try {
      await loadDashboardData();
    } catch {
      // Error state is rendered from the store.
    }
  };

  useEffect(() => {
    let isMounted = true;

    loadDashboardSummary()
      .then((summary) => {
        if (isMounted) {
          setData(mapDashboardData(summary));
        }
      }).catch(() => {
        // Error state is rendered from the store.
      });

    return () => {
      isMounted = false;
    };
  }, [loadDashboardSummary]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">CRM Dashboard</h1>
          <TimeSelector onSelectTime={handleTimeSelect} />
        </div>
      </div>

      {isLoading ? (
        <LoadingPlaceholder label="Refreshing dashboard metrics..." />
      ) : dashboard.status === "error" ? (
        <ErrorState
          message={dashboard.error}
          onRetry={() => handleTimeSelect(selectedTime)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Cards title="Total Users" value={data.totalUsers} />
            <Cards title="Open Leads" value={data.openLeads} />
            <Cards title="Won Deals" value={data.wonDeals} />
            <Cards title="Open Tickets" value={data.openTickets} />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <PieChart
              key={selectedTime + "-pie"}
              data={data.pieData}
              labels={data.pieLabels}
              title="Ticket Priority Mix"
            />
            <LineChart
              key={selectedTime + "-line"}
              data={data.lineData}
              labels={data.lineLabels}
              title="Deal Pipeline by Stage"
              datasetLabel="Deals"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
