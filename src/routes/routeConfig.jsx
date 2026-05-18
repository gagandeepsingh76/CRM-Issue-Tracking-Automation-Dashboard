import { lazy } from "react";
import { ALL_ROLES, AUTH_ROLES } from "../utils/roles";
import { ROUTES } from "./paths";

const Analytics = lazy(() => import("../pages/Analytics"));
const Customers = lazy(() => import("../pages/Customers"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Deals = lazy(() => import("../pages/Deals"));
const Employees = lazy(() => import("../pages/Employees"));
const Leads = lazy(() => import("../pages/Leads"));
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/Profile"));
const Register = lazy(() => import("../pages/Register"));
const Settings = lazy(() => import("../pages/Settings"));
const Tickets = lazy(() => import("../pages/Tickets"));

export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    title: "Login",
    description: "Sign in to the CRM Suite production workspace.",
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    title: "Register",
    description: "Create an employee CRM Suite account.",
    element: <Register />,
  },
];

export const protectedRoutes = [
  {
    path: ROUTES.DASHBOARD,
    title: "Dashboard",
    description: "Live CRM metrics, tickets, leads, and pipeline performance.",
    navLabel: "Dashboard",
    group: "Overview",
    allowedRoles: ALL_ROLES,
    element: <Dashboard />,
  },
  {
    path: ROUTES.CUSTOMERS,
    title: "Customers",
    description: "Search, create, update, and manage backend customer accounts.",
    navLabel: "Customers",
    group: "Relationships",
    allowedRoles: ALL_ROLES,
    element: <Customers />,
  },
  {
    path: ROUTES.LEADS,
    title: "Leads",
    description: "Track lead status, assignment, score, and conversion.",
    navLabel: "Leads",
    group: "Revenue",
    allowedRoles: ALL_ROLES,
    element: <Leads />,
  },
  {
    path: ROUTES.DEALS,
    title: "Deals",
    description: "Manage deal pipeline stages, probability, and ownership.",
    navLabel: "Deals",
    group: "Revenue",
    allowedRoles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER],
    element: <Deals />,
  },
  {
    path: ROUTES.TICKETS,
    title: "Tickets",
    description: "Operate the support queue with status and priority workflows.",
    navLabel: "Tickets",
    group: "Support",
    allowedRoles: ALL_ROLES,
    element: <Tickets />,
  },
  {
    path: ROUTES.EMPLOYEES,
    title: "Employees",
    description: "Administer team members and CRM role access.",
    navLabel: "Employees",
    group: "Admin",
    allowedRoles: [AUTH_ROLES.ADMIN],
    element: <Employees />,
  },
  {
    path: ROUTES.ANALYTICS,
    title: "Analytics",
    description: "Analyze revenue, pipeline, lead, and support data.",
    navLabel: "Analytics",
    group: "Overview",
    allowedRoles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER],
    element: <Analytics />,
  },
  {
    path: ROUTES.SETTINGS,
    title: "Settings",
    description: "Configure workspace policies and production integrations.",
    navLabel: "Settings",
    group: "Admin",
    allowedRoles: [AUTH_ROLES.ADMIN],
    element: <Settings />,
  },
  {
    path: ROUTES.PROFILE,
    title: "Profile",
    description: "Review authenticated profile and access details.",
    navLabel: "Profile",
    group: "Account",
    allowedRoles: ALL_ROLES,
    element: <Profile />,
  },
];
