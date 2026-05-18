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
    element: <Dashboard />,
  },
  {
    path: ROUTES.CUSTOMERS,
    title: "Customers",
    navLabel: "Customers",
    element: <Customers />,
  },
  {
    path: ROUTES.LEADS,
    title: "Leads",
    navLabel: "Leads",
    element: <Leads />,
  },
  {
    path: ROUTES.DEALS,
    title: "Deals",
    navLabel: "Deals",
    element: <Deals />,
  },
  {
    path: ROUTES.TICKETS,
    title: "Tickets",
    navLabel: "Tickets",
    element: <Tickets />,
  },
  {
    path: ROUTES.EMPLOYEES,
    title: "Employees",
    navLabel: "Employees",
    element: <Employees />,
  },
  {
    path: ROUTES.ANALYTICS,
    title: "Analytics",
    navLabel: "Analytics",
    element: <Analytics />,
  },
  {
    path: ROUTES.SETTINGS,
    title: "Settings",
    navLabel: "Settings",
    element: <Settings />,
  },
  {
    path: ROUTES.PROFILE,
    title: "Profile",
    navLabel: "Profile",
    element: <Profile />,
  },
];
