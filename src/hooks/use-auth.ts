"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { useAuthStore } from "@/stores/auth-store";
import { RegisterRequest, LoginRequest } from "@/types";
import { toast } from "sonner";

export function useRegister() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success("Registration successful!");
        router.push("/feed");
      } else {
        toast.error(response.message || "Registration failed");
      }
    },
    onError: (error: Error) => {
      console.error("Register error:", error);
      toast.error("Registration failed. Please try again.");
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response, _variables, context) => {
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success("Welcome back!");
        
        // Check for returnTo param
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get("returnTo") || "/feed";
        router.push(returnTo);
      } else {
        toast.error(response.message || "Login failed");
      }
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    toast.success("Logged out successfully");
    router.push("/login");
  };
}
