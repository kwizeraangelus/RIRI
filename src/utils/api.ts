// Forcing the base domain to use the subfolder route for firewall bypass
export const API_BASE_URL = 'https://riri.rw';

/**
 * Automatically builds your full URL path cleanly.
 * Trims any trailing slashes to prevent NestJS 307 Redirect loops.
 */
export const getApiUrl = (endpoint: string): string => {
  // 1. Ensure the endpoint has a leading slash
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 2. Clear any trailing slash if present (e.g., '/api/me/' becomes '/api/me')
  if (cleanEndpoint.endsWith('/') && cleanEndpoint.length > 1) {
    cleanEndpoint = cleanEndpoint.slice(0, -1);
  }
  
  return `${API_BASE_URL}${cleanEndpoint}`;
};
