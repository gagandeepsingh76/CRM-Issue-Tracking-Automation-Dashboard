import { env } from "../config/env";

export const API_BASE_URL = env.apiBaseUrl;

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  analytics: {
    summary: "/analytics/summary",
    pipeline: "/analytics/pipeline",
    tickets: "/analytics/tickets",
  },
  customers: "/customers",
  leads: "/leads",
  deals: "/deals",
  tickets: "/tickets",
  notifications: "/notifications",
  users: "/users",
};
