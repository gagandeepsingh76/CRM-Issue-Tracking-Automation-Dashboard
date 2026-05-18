import { useCallback, useEffect } from "react";
import ErrorState from "../components/common/ErrorState";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import ModulePage from "../components/common/ModulePage";
import { useCrmStore } from "../store/crmStore";
import { formatCurrency, formatEnum, formatPercent } from "../utils/crmFormat";

const BAR_HEIGHT_CLASS_BY_PERCENT = {
  10: "h-[10%]",
  20: "h-[20%]",
  30: "h-[30%]",
  40: "h-[40%]",
  50: "h-[50%]",
  60: "h-[60%]",
  70: "h-[70%]",
  80: "h-[80%]",
  90: "h-[90%]",
  100: "h-full",
};

const getBarHeightClass = (value, maxValue) => {
  const numericValue = Number(value ?? 0);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  const percentage = Math.max((safeValue / maxValue) * 100, 10);
  const bucket = Math.min(Math.ceil(percentage / 10) * 10, 100);

  return BAR_HEIGHT_CLASS_BY_PERCENT[bucket];
};

const Analytics = () => {
  const dashboard = useCrmStore((state) => state.dashboard);
  const pipelineAnalytics = useCrmStore((state) => state.pipelineAnalytics);
  const ticketAnalytics = useCrmStore((state) => state.ticketAnalytics);
  const loadDashboardSummary = useCrmStore((state) => state.loadDashboardSummary);
  const loadPipelineAnalytics = useCrmStore(
    (state) => state.loadPipelineAnalytics,
  );
  const loadTicketAnalytics = useCrmStore((state) => state.loadTicketAnalytics);
  const isLoading =
    dashboard.status === "loading" ||
    pipelineAnalytics.status === "loading" ||
    ticketAnalytics.status === "loading";
  const error =
    dashboard.error ?? pipelineAnalytics.error ?? ticketAnalytics.error ?? "";
  const metrics = dashboard.data?.metrics ?? {};
  const pipeline = pipelineAnalytics.data ?? [];
  const totalDeals = pipeline.reduce((sum, stage) => sum + stage.count, 0);
  const wonDeals = pipeline.find((stage) => stage.stage === "WON")?.count ?? 0;
  const winRate = totalDeals ? (wonDeals / totalDeals) * 100 : 0;
  const maxPipelineValue = Math.max(
    ...pipeline.map((stage) => Number(stage.value ?? 0)),
    1,
  );

  const loadAnalytics = useCallback(() => {
    Promise.all([
      loadDashboardSummary(),
      loadPipelineAnalytics(),
      loadTicketAnalytics(),
    ]).catch(() => {
      // Error state is rendered from the store.
    });
  }, [loadDashboardSummary, loadPipelineAnalytics, loadTicketAnalytics]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <ModulePage
      title="Analytics"
      description="Revenue, conversion, support, and pipeline performance analytics backed by the PostgreSQL CRM data."
      actions={[{ label: "Refresh", onClick: loadAnalytics, disabled: isLoading }]}
      metrics={[
        {
          label: "Won revenue",
          value: formatCurrency(metrics.wonRevenue),
          helper: "Closed-won deals",
        },
        {
          label: "Open leads",
          value: metrics.openLeads ?? 0,
          helper: "Active funnel",
        },
        {
          label: "Ticket load",
          value: metrics.openTickets ?? 0,
          helper: "Open and in progress",
        },
        {
          label: "Win rate",
          value: formatPercent(winRate),
          helper: "Won deals by pipeline count",
        },
      ]}
    >
      {isLoading ? (
        <LoadingPlaceholder label="Loading analytics from the database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAnalytics} />
      ) : (
        <div className="space-y-6">
          <div className="flex h-64 items-end gap-3 rounded-md bg-gray-50 p-4 dark:bg-slate-800">
            {pipeline.map((stage) => {
              const heightClass = getBarHeightClass(stage.value, maxPipelineValue);

              return (
                <div
                  key={stage.stage}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className={`w-full rounded-t bg-blue-600 ${heightClass}`}
                    title={`${formatEnum(stage.stage)} ${formatCurrency(stage.value)}`}
                  />
                  <span className="text-center text-xs font-medium text-gray-500 dark:text-slate-300">
                    {formatEnum(stage.stage)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {(ticketAnalytics.data?.byPriority ?? []).map((priority) => (
              <div
                key={priority.label}
                className="rounded-md border border-gray-200 p-4 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  {formatEnum(priority.label)}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                  {priority.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModulePage>
  );
};

export default Analytics;
