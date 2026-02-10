import api from "@/lib/axios";
import { ApiResponse } from "@/types";

interface FollowResponse {
  following: boolean;
}

export const followService = {
  async follow(username: string): Promise<ApiResponse<FollowResponse>> {
    const response = await api.post<ApiResponse<FollowResponse>>(`/api/follow/${username}`);
    return response.data;
  },

  async unfollow(username: string): Promise<ApiResponse<FollowResponse>> {
    const response = await api.delete<ApiResponse<FollowResponse>>(`/api/follow/${username}`);
    return response.data;
  },
};
