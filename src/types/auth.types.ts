// Auth Request Types
export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Auth User (returned after login)
export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
}

// Login Response
export interface LoginResponse {
  token: string;
  user: AuthUser;
}
