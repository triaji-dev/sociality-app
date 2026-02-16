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
    onSuccess: async (response, variables) => {
      if (response.success) {
        toast.success("Account created successfully! Logging you in...");
        
        try {
          const loginResponse = await authService.login({
            email: variables.email,
            password: variables.password,
          });

          if (loginResponse.success && loginResponse.data) {
            login(loginResponse.data.user, loginResponse.data.token);
            router.push("/timeline");
          } else {
            toast.info("Registration successful, but please login manually.");
            router.push("/login");
          }
        } catch (error) {
          console.error("Auto-login error:", error);
          toast.info("Registration successful, but please login manually.");
          router.push("/login");
        }
      } else {
        if (response.message) {
            toast.error(response.message);
        } else {
            toast.error("Registration failed");
        }
      }
    },
    onError: (error: Error) => {
      console.error("Register error:", error);
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success("Welcome back!");
        
        const params = new URLSearchParams(window.location.search);
        let returnTo = params.get("returnTo") || "/timeline";
        
        if (returnTo.startsWith("/login")) {
          returnTo = "/timeline";
        }
        
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
    toast.info("Logged out successfully");
    router.push("/login");
  };
}
