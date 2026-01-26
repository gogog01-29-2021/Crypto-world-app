export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_NORMAL = 'ROLE_NORMAL';

export const extractRolesFromToken = (token: string): string[] => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.authorities || decoded.roles || [];
  } catch (error) {
    console.error('Error decoding token:', error);
    return [];
  }
};

export const hasRole = (userRoles: string[], requiredRole: string): boolean => {
  return userRoles.includes(requiredRole);
};

export const isAdmin = (userRoles: string[]): boolean => {
  return hasRole(userRoles, ROLE_ADMIN);
};

export const isUser = (userRoles: string[]): boolean => {
  return hasRole(userRoles, ROLE_NORMAL);
};

