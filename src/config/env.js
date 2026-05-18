const DEFAULT_API_BASE_URL = "http://localhost:5000/api/v1";

export const env = Object.freeze({
  appName: import.meta.env.VITE_APP_NAME ?? "CRM Suite",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
});

export const assertFrontendEnv = () => {
  if (!env.apiBaseUrl.startsWith("http")) {
    throw new Error("VITE_API_BASE_URL must be an absolute HTTP(S) URL.");
  }
};
