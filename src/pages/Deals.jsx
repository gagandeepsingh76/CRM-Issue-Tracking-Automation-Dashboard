import ModulePage from "../components/common/ModulePage";

const Deals = () => {
  return (
    <ModulePage
      title="Deals"
      description="Monitor pipeline stages, expected revenue, close dates, and owner accountability before deal CRUD and analytics are wired."
      actions={["Add deal", "Review pipeline"]}
      metrics={[
        { label: "Pipeline", value: "$420K", helper: "Open value" },
        { label: "Won", value: "$86K", helper: "This month" },
        { label: "Forecast", value: "71%", helper: "Weighted confidence" },
        { label: "Stalled", value: "8", helper: "Needs action" },
      ]}
    >
      <div className="grid gap-3 lg:grid-cols-4">
        {["Prospecting", "Proposal", "Negotiation", "Closed"].map((stage) => (
          <div key={stage} className="rounded-md border border-gray-200 p-4">
            <p className="font-semibold text-gray-950">{stage}</p>
            <div className="mt-4 h-2 rounded-full bg-gray-100">
              <div className="h-2 w-2/3 rounded-full bg-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </ModulePage>
  );
};

export default Deals;
