import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "./auth";

const API_BASE_URL = "https://social-media-be-400174736012.asia-southeast2.run.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach auth token
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

// Response interceptor: handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      // Redirect to login if on client
      if (typeof window !== "undefined") {
        const returnTo = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?returnTo=${returnTo}`;
      }
    }
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
