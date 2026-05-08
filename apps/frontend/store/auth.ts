import { create } from "zustand";

type AuthState = {
  user: { email: string; role: string } | null;
  setUser: (user: { email: string; role: string } | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));
