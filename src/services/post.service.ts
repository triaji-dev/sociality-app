import api from "@/lib/axios";
import { ApiResponse, PaginatedResponse, PaginationParams, Post, CreatePostRequest } from "@/types";

export const postService = {
  async getFeed(params?: PaginationParams): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>("/api/feed", { params });
    return response.data;
  },

  async getPosts(params?: PaginationParams): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>("/api/posts", { params });
    return response.data;
  },

  async getPost(id: number): Promise<ApiResponse<Post>> {
    const response = await api.get<ApiResponse<Post>>(`/api/posts/${id}`);
    return response.data;
  },

  async createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
    const formData = new FormData();
    formData.append("image", data.image);
    if (data.caption) formData.append("caption", data.caption);

    const response = await api.post<ApiResponse<Post>>("/api/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deletePost(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/api/posts/${id}`);
    return response.data;
  },
};
