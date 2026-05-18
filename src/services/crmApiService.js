import { API_ENDPOINTS } from "../api/api";
import { unwrapApiData, unwrapApiMeta } from "../api/apiError";
import { httpClient } from "../api/httpClient";

const withMeta = async (request) => {
  const response = await request;
  return {
    data: unwrapApiData(response),
    meta: unwrapApiMeta(response),
  };
};

const resourceService = (path) => ({
  list: (params) => withMeta(httpClient.get(path, { params })),
  create: async (payload) => unwrapApiData(await httpClient.post(path, payload)),
  update: async (id, payload) =>
    unwrapApiData(await httpClient.patch(`${path}/${id}`, payload)),
  remove: async (id) => unwrapApiData(await httpClient.delete(`${path}/${id}`)),
});

export const customerService = resourceService(API_ENDPOINTS.customers);

export const leadService = {
  ...resourceService(API_ENDPOINTS.leads),
  updateStatus: async (id, status) =>
    unwrapApiData(
      await httpClient.patch(`${API_ENDPOINTS.leads}/${id}/status`, { status }),
    ),
};

export const dealService = {
  ...resourceService(API_ENDPOINTS.deals),
  pipeline: async () =>
    unwrapApiData(await httpClient.get(`${API_ENDPOINTS.deals}/pipeline`)),
  updateStage: async (id, payload) =>
    unwrapApiData(
      await httpClient.patch(`${API_ENDPOINTS.deals}/${id}/stage`, payload),
    ),
};

export const ticketService = {
  ...resourceService(API_ENDPOINTS.tickets),
  updatePriority: async (id, priority) =>
    unwrapApiData(
      await httpClient.patch(`${API_ENDPOINTS.tickets}/${id}/priority`, {
        priority,
      }),
    ),
};

export const analyticsService = {
  summary: async () =>
    unwrapApiData(await httpClient.get(API_ENDPOINTS.analytics.summary)),
  pipeline: async () =>
    unwrapApiData(await httpClient.get(API_ENDPOINTS.analytics.pipeline)),
  tickets: async () =>
    unwrapApiData(await httpClient.get(API_ENDPOINTS.analytics.tickets)),
};

export const notificationService = {
  list: (params) => withMeta(httpClient.get(API_ENDPOINTS.notifications, { params })),
  markRead: async (id) =>
    unwrapApiData(
      await httpClient.patch(`${API_ENDPOINTS.notifications}/${id}/read`),
    ),
  markAllRead: async () =>
    unwrapApiData(await httpClient.patch(`${API_ENDPOINTS.notifications}/read-all`)),
};

export const userService = {
  list: async (params) =>
    unwrapApiData(await httpClient.get(API_ENDPOINTS.users, { params })),
};
