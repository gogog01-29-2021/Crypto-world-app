import { api } from './axios';
import { ApiResponse, PagedResponse } from '../types/api';
import { UserDto, UserSession } from '../types/user';

/**
 * User API client
 * 
 * Note: Backend endpoints are organized into:
 * - AdminController: Admin-only endpoints (GET /admin/{userId}, GET /admin/, etc.)
 * - UserController: User profile endpoints (GET /users/me, PUT /users/me, etc.)
 */
export const usersApi = {
  // ============================================
  // Admin Endpoints (AdminController)
  // ============================================
  
  /**
   * Get all users (paginated) - Admin only
   * Endpoint: GET /api/v1/admin/
   */
  getAllUsers: async (
    pageNumber: number = 0,
    pageSize: number = 10,
    sortBy: string = 'id',
    sortDirec: string = 'asc'
  ): Promise<PagedResponse<UserDto>> => {
    const response = await api.get<PagedResponse<UserDto>>('/admin/', {
      params: { pageNumber, pageSize, sortBy, sortDirec },
    });
    return response.data;
  },

  /**
   * Get user by ID - Admin only
   * Endpoint: GET /api/v1/admin/{userId}
   */
  getUserById: async (userId: number): Promise<UserDto> => {
    const response = await api.get<UserDto>(`/admin/${userId}`);
    return response.data;
  },

  /**
   * Search users by name - Admin only
   * Endpoint: GET /api/v1/admin/search/{keywords}
   */
  searchUsers: async (keywords: string): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>(`/admin/search/${keywords}`);
    return response.data;
  },

  /**
   * Update user - Admin only
   * Endpoint: PUT /api/v1/admin/{userId}
   */
  updateUser: async (userId: number, userDto: Partial<UserDto>): Promise<UserDto> => {
    const response = await api.put<UserDto>(`/admin/${userId}`, userDto);
    return response.data;
  },

  /**
   * Delete user - Admin only
   * Endpoint: DELETE /api/v1/admin/{userId}
   */
  deleteUser: async (userId: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/admin/${userId}`);
    return response.data;
  },

  /**
   * Upload user profile photo - Admin only
   * Endpoint: POST /api/v1/admin/{userId}/profile-photo
   */
  uploadProfilePhoto: async (userId: number, file: File): Promise<UserDto> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<UserDto>(`/admin/${userId}/profile-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ============================================
  // User Profile Endpoints (UserController)
  // ============================================

  /**
   * Get current user profile
   * Endpoint: GET /api/v1/users/me
   */
  getCurrentUser: async (): Promise<UserDto> => {
    const response = await api.get<UserDto>('/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   * Endpoint: PUT /api/v1/users/me
   */
  updateCurrentUser: async (userDto: Partial<UserDto>): Promise<UserDto> => {
    const response = await api.put<UserDto>('/users/me', userDto);
    return response.data;
  },

  /**
   * Delete my account
   * Endpoint: DELETE /api/v1/users/me
   */
  deleteMyAccount: async (): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>('/users/me');
    return response.data;
  },

  /**
   * Change password
   * Endpoint: POST /api/v1/users/me/change-password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/users/me/change-password', null, {
      params: { currentPassword, newPassword },
    });
    return response.data;
  },

  /**
   * Get active sessions
   * Endpoint: GET /api/v1/users/me/sessions
   */
  getActiveSessions: async (): Promise<UserSession[]> => {
    const response = await api.get<UserSession[]>('/users/me/sessions');
    return response.data;
  },

  /**
   * Revoke session
   * Endpoint: DELETE /api/v1/users/me/sessions/{sessionId}
   */
  revokeSession: async (sessionId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/users/me/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Upload current user's profile photo
   * Endpoint: POST /api/v1/users/me/profile-photo
   */
  uploadMyProfilePhoto: async (file: File): Promise<UserDto> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<UserDto>('/users/me/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

