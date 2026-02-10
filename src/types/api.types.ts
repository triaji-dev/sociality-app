// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: PaginatedData<T> | null;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
}
