import api from "@/lib/axios";
import { ApiResponse, RegisterRequest, LoginRequest, LoginResponse } from "@/types";

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<null>> {
    const response = await api.post<ApiResponse<null>>("/api/auth/register", data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>("/api/auth/login", data);
    return response.data;
  },
};
