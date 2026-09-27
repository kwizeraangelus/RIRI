export const API_BASE_URL = 'https://riri.rw';

export const getApiUrl = (endpoint: string): string => {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.endsWith('/') && cleanEndpoint.length > 1) {
    cleanEndpoint = cleanEndpoint.slice(0, -1);
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
};