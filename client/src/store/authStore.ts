import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStore, User } from "@/types/auth";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isLoading: false,
      hasHydrated: false,

      // Actions
      setAuth: (user: User | null, accessToken: string | null) => {
        set({
          user,
          accessToken,
          isLoading: false,
        });
      },

      logout: async () => {
        set({
          user: null,
          accessToken: null,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      loginWithEmail: (email: string) => {
        if (!email) {
          set({ isLoading: false });
          return;
        }
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?login_hint=${email}`;
      },

      loginWithGoogle: () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
      },

      checkAuth: async (): Promise<boolean> => {
        const { accessToken } = get();
        return !!accessToken;
      },
      setState: (state: Partial<AuthStore>) => {
        set((prev) => ({
          ...prev,
          ...state,
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isLoading: state.isLoading,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setState({ hasHydrated: true });
      },
    }
  )
);
