// src/utils/api.ts

// Switches your base domain automatically between local and production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Automatically builds your full URL path.
 * Converts '/api/my-innovations' to 'riri.rw'
 */
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};