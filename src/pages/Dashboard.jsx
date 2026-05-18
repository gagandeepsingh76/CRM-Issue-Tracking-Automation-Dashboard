import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import TimeSelector from "../components/TimeSelector";
import { fetchDummyData } from "../services/dataService";

const DEFAULT_TIME_RANGE = "1 Week";
const DEFAULT_DASHBOARD_DATA = {
  totalUsers: 0,
  newLeads: 0,
  closedDeals: 0,
  openTickets: 0,
  pieData: [30, 50, 20],
  lineData: [100, 200, 300, 400, 500],
};

const mapDashboardData = (fetchedData = {}) => {
  const users = fetchedData.users ?? {};
  const leads = fetchedData.leads ?? {};
  const tickets = fetchedData.openTickets ?? {};
  const totalUsers =
    Number(users.active ?? 0) +
    Number(users.inactive ?? 0) +
    Number(users.new ?? 0);

  return {
    totalUsers,
    newLeads: Number(leads.converted ?? 0),
    closedDeals: Number(leads.lost ?? 0),
    openTickets: Number(tickets.open ?? 0),
    pieData: fetchedData.pieData ?? DEFAULT_DASHBOARD_DATA.pieData,
    lineData: fetchedData.lineData ?? DEFAULT_DASHBOARD_DATA.lineData,
  };
};

const loadDashboardData = async (timeRange) => {
  const fetchedData = await fetchDummyData(timeRange);
  return mapDashboardData(fetchedData);
};

const Dashboard = () => {
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME_RANGE);
  const [data, setData] = useState(DEFAULT_DASHBOARD_DATA);

  const handleTimeSelect = async (timeRange) => {
    setSelectedTime(timeRange);
    setData(await loadDashboardData(timeRange));
  };

  useEffect(() => {
    let isMounted = true;

    loadDashboardData(DEFAULT_TIME_RANGE).then((dashboardData) => {
      if (isMounted) {
        setData(dashboardData);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">CRM Dashboard</h1>
          <TimeSelector onSelectTime={handleTimeSelect} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Cards title="Total Users" value={data.totalUsers} />
        <Cards title="New Leads" value={data.newLeads} />
        <Cards title="Closed Deals" value={data.closedDeals} />
        <Cards title="Open Tickets" value={data.openTickets} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PieChart key={selectedTime + "-pie"} data={data.pieData} />
        <LineChart key={selectedTime + "-line"} data={data.lineData} />
      </div>
    </div>
  );
};

export default Dashboard;
