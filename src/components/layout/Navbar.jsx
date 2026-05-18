import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { ROUTES } from "../../routes/paths";
import { useAuthStore } from "../../store/authStore";
import { useCrmStore } from "../../store/crmStore";
import { formatDate } from "../../utils/crmFormat";
import { formatRole } from "../../utils/roles";
import ThemeToggle from "../common/ThemeToggle";
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const notifications = useCrmStore((state) => state.notifications);
  const loadNotifications = useCrmStore((state) => state.loadNotifications);
  const markNotificationRead = useCrmStore(
    (state) => state.markNotificationRead,
  );
  const markAllNotificationsRead = useCrmStore(
    (state) => state.markAllNotificationsRead,
  );
  const toast = useToast();
  const unreadCount = notifications.meta?.unread ?? 0;

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications({ limit: 5 }).catch(() => {
        toast.error("Unable to load notifications.");
      });
    }
  }, [isAuthenticated, loadNotifications, toast]);

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out.");
  };

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) {
      return;
    }

    try {
      await markNotificationRead(notification.id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      toast.success("Notifications marked as read.");
    } catch (error) {
      toast.error(error.message);
    }
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
          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              aria-label="Open notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}
            >
              <span className="text-lg leading-none">!</span>
              {unreadCount ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-950">
                    Notifications
                  </p>
                  {unreadCount ? (
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600"
                      onClick={handleMarkAllRead}
                    >
                      Mark all read
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 space-y-2">
                  {notifications.status === "loading" ? (
                    <div className="rounded-md bg-gray-50 px-3 py-3 text-sm text-gray-600">
                      Loading notifications...
                    </div>
                  ) : notifications.items.length ? (
                    notifications.items.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                          notification.isRead
                            ? "bg-gray-50 text-gray-600"
                            : "bg-blue-50 text-blue-950"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <span className="font-semibold">
                          {notification.title}
                        </span>
                        <span className="mt-1 block text-xs">
                          {notification.message}
                        </span>
                        <span className="mt-2 block text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-md bg-gray-50 px-3 py-3 text-sm text-gray-600">
                      No notifications yet.
                    </div>
                  )}
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
                    {formatRole(user?.role)}
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
