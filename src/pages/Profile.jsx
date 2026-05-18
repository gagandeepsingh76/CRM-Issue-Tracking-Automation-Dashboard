import ModulePage from "../components/common/ModulePage";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/crmFormat";
import { formatRole } from "../utils/roles";

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <ModulePage
      title="Profile"
      description="Signed-in user details loaded from the backend JWT session."
      actions={["Edit profile"]}
      metrics={[
        {
          label: "Role",
          value: formatRole(user?.role),
          helper: "Backend RBAC",
        },
        { label: "Status", value: user?.status ?? "Active", helper: "User state" },
        {
          label: "Created",
          value: formatDate(user?.createdAt),
          helper: "Account date",
        },
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
            This profile is refreshed from `/auth/me` when the app restores your
            session.
          </p>
        </div>
      </div>
    </ModulePage>
  );
};

export default Profile;
