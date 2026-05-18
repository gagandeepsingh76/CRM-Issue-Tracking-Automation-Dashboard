import axios from "axios";
import { API_BASE_URL } from "./api";
import { useAuthStore } from "../store/authStore";

export const httpClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);
