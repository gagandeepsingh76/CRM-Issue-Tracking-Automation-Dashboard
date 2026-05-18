import ModulePage from "../components/common/ModulePage";

const Settings = () => {
  return (
    <ModulePage
      title="Settings"
      description="Review workspace-level preferences for notifications, roles, integrations, and deployment environment configuration."
      actions={["Save settings"]}
      metrics={[
        { label: "Integrations", value: "4", helper: "Planned connectors" },
        { label: "Roles", value: "3", helper: "Admin, Manager, Employee" },
        { label: "Policies", value: "6", helper: "Security controls" },
        { label: "Status", value: "Ready", helper: "Frontend shell" },
      ]}
    >
      <div className="space-y-4">
        {["Workspace", "Notifications", "Security"].map((section) => (
          <div key={section} className="rounded-md border border-gray-200 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-semibold text-gray-950 dark:text-white">{section}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Production configuration is managed through environment variables
              and deployment platform settings.
            </p>
          </div>
        ))}
      </div>
    </ModulePage>
  );
};

export default Settings;
