import { create } from "zustand";
import { AuthUser } from "@/types";
import { getToken, setToken, removeToken } from "@/lib/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  hydrate: () => void;
  setUser: (user: AuthUser) => void;
}

type AuthStore = AuthState & AuthActions;

const USER_KEY = "sociality_user";

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function removeStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isHydrated: false,

  login: (user, token) => {
    setToken(token);
    setStoredUser(user);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    removeToken();
    removeStoredUser();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  hydrate: () => {
    const token = getToken();
    const user = getStoredUser();

    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isHydrated: true,
      });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isHydrated: true,
      });
    }
  },

  setUser: (user) => {
    setStoredUser(user);
    set({ user });
  },
}));
