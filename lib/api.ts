const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error('Request failed');
  }

  return res.json();
};