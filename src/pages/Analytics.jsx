import ModulePage from "../components/common/ModulePage";

const Analytics = () => {
  return (
    <ModulePage
      title="Analytics"
      description="Expand the current dashboard into revenue, conversion, support, and team performance analytics backed by real APIs."
      actions={["Export", "Schedule report"]}
      metrics={[
        { label: "Revenue", value: "$86K", helper: "Mock monthly total" },
        { label: "Lead conversion", value: "28%", helper: "Mock funnel rate" },
        { label: "Ticket load", value: "37", helper: "Currently open" },
        { label: "Win rate", value: "41%", helper: "Mock deal close rate" },
      ]}
    >
      <div className="flex h-56 items-end gap-3 rounded-md bg-gray-50 p-4">
        {[35, 55, 42, 78, 64, 88, 72].map((height, index) => (
          <div
            key={height + index}
            className="flex flex-1 items-end rounded-t bg-blue-600"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </ModulePage>
  );
};

export default Analytics;
