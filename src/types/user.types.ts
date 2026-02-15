// Profile data structure
export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt?: string;
}

// My Profile (authenticated user's full profile)
export interface MyProfile {
  profile: UserProfile;
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
}

// Public Profile (visible to others)
export interface PublicProfile {
  id: number;
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

// User in search results
export interface UserSearchResult {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}

// User in followers/following lists
export interface UserListItem {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
  followsMe: boolean;
}

// Update profile request
export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: File;
  avatarUrl?: string;
}

// Liker (user who liked a post)
export interface Liker {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
}

// Follow/Unfollow Response
export interface FollowResponse {
  following: boolean;
}
