import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "../services/authService";
import { AUTH_STORAGE_KEY } from "../utils/authToken";

const initialRequestState = {
  status: "idle",
  error: null,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hasHydrated: false,
      ...initialRequestState,

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      clearError: () => set({ error: null }),
      isAuthenticated: () => Boolean(get().user && get().token),

      login: async (credentials) => {
        set({ status: "loading", error: null });

        try {
          const session = await authService.login(credentials);
          set({
            user: session.user,
            token: session.token,
            status: "authenticated",
            error: null,
          });
          return session;
        } catch (error) {
          set({ status: "error", error: error.message });
          throw error;
        }
      },

      register: async (payload) => {
        set({ status: "loading", error: null });

        try {
          const session = await authService.register(payload);
          set({
            user: session.user,
            token: session.token,
            status: "authenticated",
            error: null,
          });
          return session;
        } catch (error) {
          set({ status: "error", error: error.message });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          ...initialRequestState,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
