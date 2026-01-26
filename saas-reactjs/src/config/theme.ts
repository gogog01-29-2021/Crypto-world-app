/**
 * Theme configuration
 * Centralized styling constants for consistent UI
 */

export const TOAST_STYLES = {
  error: {
    background: '#1e293b',
    color: '#fca5a5',
    border: '1px solid #ef4444',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  success: {
    background: '#1e293b',
    color: '#86efac',
    border: '1px solid #22c55e',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  info: {
    background: '#1e293b',
    color: '#93c5fd',
    border: '1px solid #3b82f6',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  warning: {
    background: '#1e293b',
    color: '#fcd34d',
    border: '1px solid #f59e0b',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
} as const;

export const ICON_THEME = {
  error: {
    primary: '#ef4444',
    secondary: '#ffffff',
  },
  success: {
    primary: '#22c55e',
    secondary: '#ffffff',
  },
  info: {
    primary: '#3b82f6',
    secondary: '#ffffff',
  },
  warning: {
    primary: '#f59e0b',
    secondary: '#ffffff',
  },
} as const;

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
} as const;

export const GRADIENT_CLASSES = {
  primary: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  secondary: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
  text: 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent',
} as const;

