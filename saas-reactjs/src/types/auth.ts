export interface JwtRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  jwtToken: string;
  refreshToken: string;
  username: string;
  tokenType?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  about?: string;
}

