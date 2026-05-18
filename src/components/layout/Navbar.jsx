import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { ROUTES } from "../../routes/paths";
import { useAuthStore } from "../../store/authStore";
import Breadcrumbs from "./Breadcrumbs";

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Navbar = ({ currentRoute, onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out.");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 lg:hidden"
            onClick={onMenuClick}
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>

          <div className="min-w-0">
            <Breadcrumbs currentRoute={currentRoute} />
            <h1 className="truncate text-xl font-semibold text-gray-950">
              {currentRoute.title}
            </h1>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-label="Open notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}
            >
              <span className="text-lg leading-none">!</span>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                <p className="text-sm font-semibold text-gray-950">
                  Notifications
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    "Backend notifications will appear here.",
                    "Ticket SLA alerts are planned for Phase 8.",
                  ].map((message) => (
                    <div
                      key={message}
                      className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600"
                    >
                      {message}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {getInitials(user?.name)}
              </span>
              <span className="hidden sm:block">{user?.name}</span>
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                <div className="border-b border-gray-100 pb-3">
                  <p className="font-semibold text-gray-950">{user?.name}</p>
                  <p className="truncate text-sm text-gray-500">
                    {user?.email}
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                    {user?.role}
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to={ROUTES.PROFILE}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    View profile
                  </Link>
                  <button
                    type="button"
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  currentRoute: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default Navbar;
