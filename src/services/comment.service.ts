import api from "@/lib/axios";
import { ApiResponse, PaginatedResponse, PaginationParams, Comment, CreateCommentRequest, DeleteResponse } from "@/types";

export const commentService = {
  async getComments(postId: number, params?: PaginationParams): Promise<PaginatedResponse<Comment>> {
    const response = await api.get<PaginatedResponse<Comment>>(`/api/posts/${postId}/comments`, { params });
    return response.data;
  },

  async addComment(postId: number, data: CreateCommentRequest): Promise<ApiResponse<Comment>> {
    const response = await api.post<ApiResponse<Comment>>(`/api/posts/${postId}/comments`, data);
    return response.data;
  },

  async deleteComment(commentId: number): Promise<ApiResponse<DeleteResponse>> {
    const response = await api.delete<ApiResponse<DeleteResponse>>(`/api/comments/${commentId}`);
    return response.data;
  },
};
