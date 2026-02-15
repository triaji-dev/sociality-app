// Post Author (embedded in post)
export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

// Post
export interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe?: boolean;
  createdAt: string;
}

// Liked Post — extends Post with timestamp of when user liked it
export interface LikedPost extends Post {
  likedAt: string;
}

// Saved Post — minimal fields returned by GET /api/me/saved
export interface SavedPost {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

// Comment Author (embedded in comment)
export interface CommentAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

// Comment
export interface Comment {
  id: number;
  text: string;
  author: CommentAuthor;
  createdAt: string;
  isMine: boolean;
}

// Create Post Request
export interface CreatePostRequest {
  image: File;
  caption?: string;
}

// Create Comment Request
export interface CreateCommentRequest {
  text: string;
}

// Like/Unlike Response
export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

// Delete Response (posts & comments)
export interface DeleteResponse {
  deleted: boolean;
}

// Save/Unsave Response
export interface SaveResponse {
  saved: boolean;
}
