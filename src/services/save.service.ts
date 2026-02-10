import api from "@/lib/axios";
import { ApiResponse } from "@/types";

interface SaveResponse {
  saved: boolean;
}

export const saveService = {
  async savePost(postId: number): Promise<ApiResponse<SaveResponse>> {
    const response = await api.post<ApiResponse<SaveResponse>>(`/api/posts/${postId}/save`);
    return response.data;
  },

  async unsavePost(postId: number): Promise<ApiResponse<SaveResponse>> {
    const response = await api.delete<ApiResponse<SaveResponse>>(`/api/posts/${postId}/save`);
    return response.data;
  },
};
