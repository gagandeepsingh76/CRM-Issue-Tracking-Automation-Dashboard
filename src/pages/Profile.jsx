import ModulePage from "../components/common/ModulePage";
import { useAuthStore } from "../store/authStore";

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <ModulePage
      title="Profile"
      description="Show signed-in user details, role, preferences, and session controls once JWT authentication is implemented."
      actions={["Edit profile"]}
      metrics={[
        { label: "Role", value: user?.role ?? "Unknown", helper: "Mock auth" },
        { label: "Team", value: "Sales", helper: "Mock assignment" },
        { label: "Tasks", value: "14", helper: "Open workload" },
        { label: "Session", value: "JWT", helper: "Persisted locally" },
      ]}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          {user?.name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
        <div>
          <p className="text-lg font-semibold text-gray-950">
            {user?.name}
          </p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="mt-2 text-sm text-gray-600">
            This profile is backed by the temporary mock authentication store.
          </p>
        </div>
      </div>
    </ModulePage>
  );
};

export default Profile;
