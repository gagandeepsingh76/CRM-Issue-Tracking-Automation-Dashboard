import ModulePage from "../components/common/ModulePage";

const Employees = () => {
  return (
    <ModulePage
      title="Employees"
      description="Manage internal CRM users, role assignments, team ownership, and operational access as the RBAC layer arrives."
      actions={["Invite user", "Manage roles"]}
      metrics={[
        { label: "Team members", value: "18", helper: "Across roles" },
        { label: "Admins", value: "3", helper: "Full access" },
        { label: "Managers", value: "5", helper: "Team access" },
        { label: "Employees", value: "10", helper: "Assigned work" },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-3">
        {["Admin", "Manager", "Employee"].map((role) => (
          <div key={role} className="rounded-md border border-gray-200 p-4">
            <p className="font-semibold text-gray-950">{role}</p>
            <p className="mt-1 text-sm text-gray-500">
              Permission profile placeholder
            </p>
          </div>
        ))}
      </div>
    </ModulePage>
  );
};

export default Employees;
