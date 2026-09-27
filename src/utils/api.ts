// Forcing the base domain to use the subfolder route 
export const API_BASE_URL = 'https://riri.rw';

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
