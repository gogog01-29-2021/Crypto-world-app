import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { queryKeys } from '../config';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';
import { logger } from '../utils/logger';

/**
 * Custom hook for fetching active sessions
 */
export const useSessions = () => {
  return useQuery({
    queryKey: queryKeys.sessions.list(),
    queryFn: () => usersApi.getActiveSessions(),
    staleTime: 2 * 60 * 1000, // Sessions data is fresh for 2 minutes
  });
};

/**
 * Custom hook for revoking a session
 */
export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => usersApi.revokeSession(sessionId),
    onSuccess: (_, sessionId) => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.list() });
      showSuccessToast('Session revoked successfully');
      logger.userAction('Session revoked', { sessionId });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to revoke session');
      logger.error('Session revoke failed', error);
    },
  });
};

