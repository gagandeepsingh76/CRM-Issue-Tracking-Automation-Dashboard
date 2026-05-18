import Analytics from "../pages/Analytics";
import Customers from "../pages/Customers";
import Dashboard from "../pages/Dashboard";
import Deals from "../pages/Deals";
import Employees from "../pages/Employees";
import Leads from "../pages/Leads";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Settings from "../pages/Settings";
import Tickets from "../pages/Tickets";
import { ALL_ROLES, AUTH_ROLES } from "../utils/roles";
import { ROUTES } from "./paths";

export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    title: "Login",
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    title: "Register",
    element: <Register />,
  },
];

export const protectedRoutes = [
  {
    path: ROUTES.DASHBOARD,
    title: "Dashboard",
    navLabel: "Dashboard",
    group: "Overview",
    allowedRoles: ALL_ROLES,
    element: <Dashboard />,
  },
  {
    path: ROUTES.CUSTOMERS,
    title: "Customers",
    navLabel: "Customers",
    group: "Relationships",
    allowedRoles: ALL_ROLES,
    element: <Customers />,
  },
  {
    path: ROUTES.LEADS,
    title: "Leads",
    navLabel: "Leads",
    group: "Revenue",
    allowedRoles: ALL_ROLES,
    element: <Leads />,
  },
  {
    path: ROUTES.DEALS,
    title: "Deals",
    navLabel: "Deals",
    group: "Revenue",
    allowedRoles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER],
    element: <Deals />,
  },
  {
    path: ROUTES.TICKETS,
    title: "Tickets",
    navLabel: "Tickets",
    group: "Support",
    allowedRoles: ALL_ROLES,
    element: <Tickets />,
  },
  {
    path: ROUTES.EMPLOYEES,
    title: "Employees",
    navLabel: "Employees",
    group: "Admin",
    allowedRoles: [AUTH_ROLES.ADMIN],
    element: <Employees />,
  },
  {
    path: ROUTES.ANALYTICS,
    title: "Analytics",
    navLabel: "Analytics",
    group: "Overview",
    allowedRoles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER],
    element: <Analytics />,
  },
  {
    path: ROUTES.SETTINGS,
    title: "Settings",
    navLabel: "Settings",
    group: "Admin",
    allowedRoles: [AUTH_ROLES.ADMIN],
    element: <Settings />,
  },
  {
    path: ROUTES.PROFILE,
    title: "Profile",
    navLabel: "Profile",
    group: "Account",
    allowedRoles: ALL_ROLES,
    element: <Profile />,
  },
];
