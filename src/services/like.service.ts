import api from "@/lib/axios";
import { ApiResponse, PaginatedResponse, PaginationParams, LikeResponse, Liker } from "@/types";

export const likeService = {
  async likePost(postId: number): Promise<ApiResponse<LikeResponse>> {
    const response = await api.post<ApiResponse<LikeResponse>>(`/api/posts/${postId}/like`);
    return response.data;
  },

  async unlikePost(postId: number): Promise<ApiResponse<LikeResponse>> {
    const response = await api.delete<ApiResponse<LikeResponse>>(`/api/posts/${postId}/like`);
    return response.data;
  },

  async getLikers(postId: number, params?: PaginationParams): Promise<PaginatedResponse<Liker>> {
    const response = await api.get<PaginatedResponse<Liker>>(`/api/posts/${postId}/likes`, { params });
    return response.data;
  },
};
