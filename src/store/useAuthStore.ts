// store/useAuthStore.ts
import { UserType } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserType | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => {
    set({ user: user, isAuthenticated: !!user, isLoading: false });
  },
  logout: async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to clear session on server");
      }

      set({ user: null, isAuthenticated: false, isLoading: false });

      window.location.href = `/signin?redirect=${encodeURIComponent(window.location.pathname)}`;
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
