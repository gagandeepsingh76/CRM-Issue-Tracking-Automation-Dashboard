import { API_ENDPOINTS } from "../api/api";
import { unwrapApiData } from "../api/apiError";
import { httpClient } from "../api/httpClient";

const normalizeSession = (session) => ({
  user: session.user,
  token: session.token,
});

const withoutRole = (payload) => {
  const nextPayload = { ...payload };
  delete nextPayload.role;
  return nextPayload;
};

export const authService = {
  login: async ({ email, password }) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.login, {
      email,
      password,
    });
    return normalizeSession(unwrapApiData(response));
  },

  register: async (payload) => {
    const response = await httpClient.post(
      API_ENDPOINTS.auth.register,
      withoutRole(payload),
    );
    return normalizeSession(unwrapApiData(response));
  },

  me: async () => {
    const response = await httpClient.get(API_ENDPOINTS.auth.me);
    return unwrapApiData(response);
  },
};
