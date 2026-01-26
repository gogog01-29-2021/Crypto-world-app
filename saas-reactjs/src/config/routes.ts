/**
 * Application routes
 * Centralized route definitions for consistency and easy maintenance
 */

export const ROUTES = {
  // Public routes
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
  },
  
  // User routes
  USER: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    CHANGE_PASSWORD: '/change-password',
    SESSIONS: '/sessions',
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAIL: (id: number | string) => `/admin/users/${id}`,
    USER_EDIT: (id: number | string) => `/admin/users/${id}/edit`,
    PROFILE: '/admin/profile',
    SESSIONS: '/admin/sessions',
  },
  
  // Special routes
  AUTH_REDIRECT: '/auth-redirect',
} as const;

/**
 * Check if a path matches a route pattern
 */
export const matchRoute = (path: string, route: string): boolean => {
  // Simple pattern matching - can be extended with more complex logic
  const routePattern = route.replace(/:\w+/g, '[^/]+');
  const regex = new RegExp(`^${routePattern}$`);
  return regex.test(path);
};

/**
 * Get route title for display purposes
 */
export const getRouteTitle = (path: string): string => {
  const titles: Record<string, string> = {
    '/': 'Home',
    '/login': 'Login',
    '/register': 'Register',
    '/forgot-password': 'Forgot Password',
    '/reset-password': 'Reset Password',
    '/verify-email': 'Verify Email',
    '/dashboard': 'Dashboard',
    '/profile': 'Profile',
    '/change-password': 'Change Password',
    '/sessions': 'Active Sessions',
    '/admin/dashboard': 'Admin Dashboard',
    '/admin/users': 'User Management',
    '/admin/profile': 'Admin Profile',
    '/admin/sessions': 'Admin Sessions',
  };

  return titles[path] || 'Page';
};

