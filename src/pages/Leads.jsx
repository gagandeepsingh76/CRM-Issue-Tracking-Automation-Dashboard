import ModulePage from "../components/common/ModulePage";

const Leads = () => {
  return (
    <ModulePage
      title="Leads"
      description="Track lead status, ownership, source, and conversion readiness. Assignment workflows will connect here after the backend phase."
      actions={["Create lead", "Assign"]}
      metrics={[
        { label: "New leads", value: "43", helper: "This week" },
        { label: "Qualified", value: "21", helper: "Ready for sales" },
        { label: "Conversion", value: "28%", helper: "Mock rate" },
        { label: "Sources", value: "5", helper: "Web, email, referral" },
      ]}
    >
      <div className="space-y-3">
        {["New", "Contacted", "Qualified", "Converted"].map((stage) => (
          <div
            key={stage}
            className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
          >
            <span className="font-medium text-gray-900">{stage}</span>
            <span className="text-sm text-gray-500">Pipeline placeholder</span>
          </div>
        ))}
      </div>
    </ModulePage>
  );
};

export default Leads;
