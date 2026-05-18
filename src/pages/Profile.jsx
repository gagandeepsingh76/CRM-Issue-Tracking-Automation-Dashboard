import ModulePage from "../components/common/ModulePage";

const Profile = () => {
  return (
    <ModulePage
      title="Profile"
      description="Show signed-in user details, role, preferences, and session controls once JWT authentication is implemented."
      actions={["Edit profile"]}
      metrics={[
        { label: "Role", value: "Admin", helper: "Preview mode" },
        { label: "Team", value: "Sales", helper: "Mock assignment" },
        { label: "Tasks", value: "14", helper: "Open workload" },
        { label: "Session", value: "Local", helper: "Auth pending" },
      ]}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          GS
        </span>
        <div>
          <p className="text-lg font-semibold text-gray-950">
            Gagandeep Singh
          </p>
          <p className="text-sm text-gray-500">gagandeep@example.com</p>
          <p className="mt-2 text-sm text-gray-600">
            Placeholder profile data for the upcoming authentication phase.
          </p>
        </div>
      </div>
    </ModulePage>
  );
};

export default Profile;
