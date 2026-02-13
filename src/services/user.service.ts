import api from "@/lib/axios";
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  MyProfile,
  UserProfile,
  PublicProfile,
  UserSearchResult,
  UserListItem,
  UpdateProfileRequest,
  Post,
  LikedPost,
  SavedPost,
} from "@/types";

export const userService = {
  // My Profile
  async getMe(): Promise<ApiResponse<MyProfile>> {
    const response = await api.get<ApiResponse<MyProfile>>("/api/me");
    return response.data;
  },

  async updateMe(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.username !== undefined) formData.append("username", data.username);
    if (data.phone !== undefined) formData.append("phone", data.phone);
    if (data.bio !== undefined) formData.append("bio", data.bio);
    if (data.avatar) formData.append("avatar", data.avatar);

    const response = await api.patch<ApiResponse<UserProfile>>("/api/me", formData);
    return response.data;
  },

  async getMyPosts(params?: PaginationParams): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>("/api/me/posts", { params });
    return response.data;
  },

  async getMyLikes(params?: PaginationParams): Promise<PaginatedResponse<LikedPost>> {
    const response = await api.get<PaginatedResponse<LikedPost>>("/api/me/likes", { params });
    return response.data;
  },

  async getMySaved(params?: PaginationParams): Promise<PaginatedResponse<SavedPost>> {
    const response = await api.get<PaginatedResponse<SavedPost>>("/api/me/saved", { params });
    return response.data;
  },

  async getMyFollowers(params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> {
    const response = await api.get<PaginatedResponse<UserListItem>>("/api/me/followers", { params });
    return response.data;
  },

  async getMyFollowing(params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> {
    const response = await api.get<PaginatedResponse<UserListItem>>("/api/me/following", { params });
    return response.data;
  },

  // Public Users
  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<UserSearchResult>> {
    const response = await api.get<PaginatedResponse<UserSearchResult>>("/api/users/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },

  async getUser(username: string): Promise<ApiResponse<PublicProfile>> {
    const response = await api.get<ApiResponse<PublicProfile>>(`/api/users/${username}`);
    return response.data;
  },

  async getUserPosts(username: string, params?: PaginationParams): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>(`/api/users/${username}/posts`, { params });
    return response.data;
  },

  async getUserLikes(username: string, params?: PaginationParams): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>(`/api/users/${username}/likes`, { params });
    return response.data;
  },

  async getUserFollowers(username: string, params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> {
    const response = await api.get<PaginatedResponse<UserListItem>>(`/api/users/${username}/followers`, { params });
    return response.data;
  },

  async getUserFollowing(username: string, params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> {
    const response = await api.get<PaginatedResponse<UserListItem>>(`/api/users/${username}/following`, { params });
    return response.data;
  },
};
