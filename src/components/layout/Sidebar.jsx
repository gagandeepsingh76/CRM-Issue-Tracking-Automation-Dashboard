import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "../../routes/paths";
import { protectedRoutes } from "../../routes/routeConfig";

const navLinkClasses = ({ isActive }) =>
  [
    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-blue-600 text-white shadow-sm"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-950",
  ].join(" ");

const SidebarContent = ({ onClose }) => {
  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            CRM
          </span>
          <span className="text-base font-bold text-gray-950">CRM Suite</span>
        </Link>

        <button
          type="button"
          aria-label="Close navigation"
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 lg:hidden"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {protectedRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={navLinkClasses}
            onClick={onClose}
          >
            {route.navLabel}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Current role
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-900">
          Admin preview
        </p>
      </div>
    </div>
  );
};

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
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
          <aside className="relative h-full w-72 max-w-[85vw]">
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
