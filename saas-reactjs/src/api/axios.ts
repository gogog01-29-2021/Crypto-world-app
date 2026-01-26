import axios, { AxiosError } from 'axios';
import { storage } from '../utils/storage';
import { showErrorToast } from '../utils/errorHandler';
import { API_CONFIG } from '../config';

export const api = axios.create({
  baseURL: API_CONFIG.baseURL ? `${API_CONFIG.baseURL}/api/v1` : '/api/v1',
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config: any) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_CONFIG.baseURL}/api/v1/auth/refresh-token`,
            null,
            {
              params: { refreshToken },
            }
          );

          const { jwtToken } = response.data;
          storage.setToken(jwtToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${jwtToken}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          storage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        storage.clear();
        window.location.href = '/login';
      }
    }

    // Handle other errors
    if (error.response) {
      // Don't show toast for 401 (handled above) or if it's a validation error (400)
      // Validation errors should be handled by the component
      if (error.response.status !== 401 && error.response.status !== 400) {
        showErrorToast(error);
      }
    } else if (error.request) {
      showErrorToast(new Error('Network error. Please check your connection.'));
    } else {
      showErrorToast(error);
    }

    return Promise.reject(error);
  }
);

