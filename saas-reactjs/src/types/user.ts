export interface Role {
  id: number;
  name: string;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  password?: string;
  about?: string;
  roles?: Role[];
  profileImageUrl?: string;
}

export interface UserSession {
  id: number;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  loginTime: string;
  lastActivity?: string;
  expiresAt: string;
  isActive: boolean;
}

