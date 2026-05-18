import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "../../routes/paths";
import { protectedRoutes } from "../../routes/routeConfig";
import { useAuthStore } from "../../store/authStore";
import { canAccessRoute, formatRole } from "../../utils/roles";

const navLinkClasses = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500",
    isActive
      ? "bg-blue-600 text-white shadow-sm"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  ].join(" ");

const navIconPaths = {
  [ROUTES.DASHBOARD]: [
    "M3 13h8V3H3v10Z",
    "M13 21h8V11h-8v10Z",
    "M13 3h8v6h-8V3Z",
    "M3 21h8v-6H3v6Z",
  ],
  [ROUTES.CUSTOMERS]: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M16 3.13a4 4 0 0 1 0 7.75",
    "M22 21v-2a4 4 0 0 0-3-3.87",
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  ],
  [ROUTES.LEADS]: [
    "M12 2v4",
    "M12 18v4",
    "M2 12h4",
    "M18 12h4",
    "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  ],
  [ROUTES.DEALS]: [
    "M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1",
    "M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    "M3 13h18",
  ],
  [ROUTES.TICKETS]: [
    "M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2Z",
    "M13 5v14",
    "M13 9v.01",
    "M13 15v.01",
  ],
  [ROUTES.EMPLOYEES]: [
    "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2",
    "M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M17 11l2 2 4-4",
  ],
  [ROUTES.ANALYTICS]: [
    "M4 19V9",
    "M10 19V5",
    "M16 19v-7",
    "M22 19H2",
  ],
  [ROUTES.SETTINGS]: [
    "M4 21v-7",
    "M4 10V3",
    "M12 21v-9",
    "M12 8V3",
    "M20 21v-5",
    "M20 12V3",
    "M2 14h4",
    "M10 8h4",
    "M18 16h4",
  ],
  [ROUTES.PROFILE]: [
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M6 20a6 6 0 0 1 12 0",
  ],
};

const NavIcon = ({ path }) => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    {(navIconPaths[path] ?? navIconPaths[ROUTES.DASHBOARD]).map((pathData) => (
      <path key={pathData} d={pathData} />
    ))}
  </svg>
);

const SidebarContent = ({ onClose }) => {
  const user = useAuthStore((state) => state.user);
  const visibleRoutes = protectedRoutes.filter((route) =>
    canAccessRoute(user?.role, route.allowedRoles),
  );
  const groupedRoutes = visibleRoutes.reduce((groups, route) => {
    const groupName = route.group ?? "Workspace";
    return {
      ...groups,
      [groupName]: [...(groups[groupName] ?? []), route],
    };
  }, {});

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            CRM
          </span>
          <span className="text-base font-bold text-gray-950 dark:text-white">
            CRM Suite
          </span>
        </Link>

        <button
          type="button"
          aria-label="Close navigation"
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {Object.entries(groupedRoutes).map(([groupName, routes]) => (
            <div key={groupName}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
                {groupName}
              </p>
              <div className="mt-2 space-y-1">
                {routes.map((route) => (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={navLinkClasses}
                    onClick={onClose}
                  >
                    <NavIcon path={route.path} />
                    <span>{route.navLabel}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-slate-800">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-500">
          Current role
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
          {formatRole(user?.role)}
        </p>
      </div>
    </div>
  );
};

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

NavIcon.propTypes = {
  path: PropTypes.string.isRequired,
};

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <SidebarContent onClose={onClose} />
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-gray-950/40"
            onClick={onClose}
          />
          <aside className="relative h-full w-72 max-w-[85vw] animate-sidebar-enter">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
