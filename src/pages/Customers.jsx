import ModulePage from "../components/common/ModulePage";

const Customers = () => {
  return (
    <ModulePage
      title="Customers"
      description="Centralize company accounts, contacts, ownership, and customer health before full CRUD connects in the CRM module phase."
      actions={["Add customer", "Import"]}
      metrics={[
        { label: "Accounts", value: "128", helper: "Mock portfolio data" },
        { label: "Active", value: "94", helper: "Engaged this quarter" },
        { label: "At risk", value: "12", helper: "Needs follow-up" },
        { label: "Segments", value: "6", helper: "Enterprise to SMB" },
      ]}
    >
      <div className="overflow-hidden">
        <div className="grid gap-4 md:grid-cols-3">
          {["Acme Corp", "Northstar Labs", "BluePeak Retail"].map((name) => (
            <div key={name} className="rounded-md border border-gray-200 p-4">
              <p className="font-semibold text-gray-950">{name}</p>
              <p className="mt-1 text-sm text-gray-500">
                Customer record placeholder
              </p>
            </div>
          ))}
        </div>
      </div>
    </ModulePage>
  );
};

export default Customers;
