/**
 * Error handler utility tests
 */

import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import { getErrorMessage, isPasswordError, isAuthError } from '../errorHandler';

describe('errorHandler', () => {
  describe('getErrorMessage', () => {
    it('extracts message from AxiosError response', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: {
            message: 'Custom error message',
          },
          status: 400,
        },
      } as AxiosError;

      const message = getErrorMessage(error);
      expect(message).toBe('Custom error message');
    });

    it('formats bad credentials error', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: {
            message: 'Bad credentials',
          },
          status: 401,
        },
      } as AxiosError;

      const message = getErrorMessage(error);
      expect(message).toContain('Invalid email or password');
    });

    it('handles 404 errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      } as AxiosError;

      const message = getErrorMessage(error);
      expect(message).toContain('not found');
    });

    it('handles 500 errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 500,
        },
      } as AxiosError;

      const message = getErrorMessage(error);
      expect(message).toContain('Server error');
    });

    it('handles generic Error objects', () => {
      const error = new Error('Something went wrong');
      const message = getErrorMessage(error);
      expect(message).toBe('Something went wrong');
    });

    it('handles unknown errors', () => {
      const message = getErrorMessage('unknown error');
      expect(message).toContain('unexpected error');
    });
  });

  describe('isPasswordError', () => {
    it('returns true for password-related errors', () => {
      const error = new Error('Invalid password');
      expect(isPasswordError(error)).toBe(true);
    });

    it('returns true for credential errors', () => {
      const error = new Error('Bad credentials');
      expect(isPasswordError(error)).toBe(true);
    });

    it('returns false for non-password errors', () => {
      const error = new Error('Network error');
      expect(isPasswordError(error)).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('returns true for 401 errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 401,
        },
      } as AxiosError;

      expect(isAuthError(error)).toBe(true);
    });

    it('returns true for 403 errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 403,
        },
      } as AxiosError;

      expect(isAuthError(error)).toBe(true);
    });

    it('returns false for other errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
        },
      } as AxiosError;

      expect(isAuthError(error)).toBe(false);
    });
  });
});

