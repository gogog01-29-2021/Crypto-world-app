import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { queryKeys } from '../config';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';
import { UserDto } from '../types/user';

/**
 * Custom hook for fetching all users (admin only)
 */
export const useUsers = (
  pageNumber: number = 0,
  pageSize: number = 10,
  sortBy: string = 'id',
  sortDirec: string = 'asc'
) => {
  return useQuery({
    queryKey: queryKeys.users.list({ pageNumber, pageSize, sortBy, sortDirec }),
    queryFn: () => usersApi.getAllUsers(pageNumber, pageSize, sortBy, sortDirec),
  });
};

/**
 * Custom hook for fetching a single user by ID (admin only)
 */
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId, // Only fetch if userId is provided
  });
};

/**
 * Custom hook for fetching current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: () => usersApi.getCurrentUser(),
  });
};

/**
 * Custom hook for searching users (admin only)
 */
export const useUserSearch = (keywords: string) => {
  return useQuery({
    queryKey: queryKeys.users.search(keywords),
    queryFn: () => usersApi.searchUsers(keywords),
    enabled: keywords.length > 0, // Only search if keywords provided
  });
};

/**
 * Custom hook for updating user (admin only)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userDto }: { userId: number; userDto: Partial<UserDto> }) =>
      usersApi.updateUser(userId, userDto),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.setQueryData(queryKeys.users.detail(variables.userId), data);
      showSuccessToast('User updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update user');
    },
  });
};

/**
 * Custom hook for updating current user profile
 */
export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userDto: Partial<UserDto>) => usersApi.updateCurrentUser(userDto),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.users.current(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      showSuccessToast('Profile updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update profile');
    },
  });
};

/**
 * Custom hook for deleting user (admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      showSuccessToast('User deleted successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to delete user');
    },
  });
};

/**
 * Custom hook for deleting own account
 */
export const useDeleteMyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.deleteMyAccount(),
    onSuccess: () => {
      queryClient.clear(); // Clear all queries on account deletion
      showSuccessToast('Account deleted successfully');
      // Redirect to login will be handled by the component
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to delete account');
    },
  });
};

/**
 * Custom hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      usersApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      showSuccessToast('Password changed successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to change password');
    },
  });
};

