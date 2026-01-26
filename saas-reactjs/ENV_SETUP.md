# Environment Setup Guide

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:9090
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Required

#### `VITE_API_BASE_URL`
- **Type**: String (URL)
- **Default**: 
  - Development: `http://localhost:9090`
  - Production (Docker): Empty (nginx proxy)
- **Examples**:
  ```env
  # Local development
  VITE_API_BASE_URL=http://localhost:9090
  
  # Docker with nginx
  VITE_API_BASE_URL=
  
  # Production
  VITE_API_BASE_URL=https://api.yourdomain.com
  ```

## Docker Setup

When running in Docker with nginx:

1. Leave `VITE_API_BASE_URL` empty
2. Nginx handles proxying

## Troubleshooting

### API Calls Failing
1. Check `VITE_API_BASE_URL` is correct
2. Verify backend is running
3. Check CORS settings

### Environment Variables Not Loading
1. Restart Vite dev server
2. Check variables are prefixed with `VITE_`
3. Clear browser cache

## Security

1. Never commit `.env.local` or `.env.production`
2. All `VITE_*` variables are exposed to client
3. Never put secrets in environment variables

For more details, see the full backend documentation.

