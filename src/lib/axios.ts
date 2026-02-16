import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://social-media-be-400174736012.asia-southeast2.run.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

const COLLECTION_KEYS = ["posts", "users", "comments"] as const;

function normalizePaginatedData(data: Record<string, unknown>): Record<string, unknown> {
  if (!data || typeof data !== "object" || !("pagination" in data)) return data;

  for (const key of COLLECTION_KEYS) {
    if (key in data && Array.isArray(data[key])) {
      const { [key]: items, ...rest } = data;
      return { ...rest, items };
    }
  }
  return data;
}

api.interceptors.response.use(
  (response) => {
    if (response.data?.data && typeof response.data.data === "object") {
      response.data.data = normalizePaginatedData(response.data.data as Record<string, unknown>);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      
      if (typeof window !== "undefined") {
        const isLoginPage = window.location.pathname === "/login";
        const isLoginRequest = error.config?.url?.includes("/api/auth/login");
        
        if (!isLoginPage && !isLoginRequest) {
          const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?returnTo=${returnTo}`;
        }
      }
    }
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
