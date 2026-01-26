export interface ApiResponse {
  message: string;
  success: boolean;
  timestamp?: string;
  errorCode?: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
