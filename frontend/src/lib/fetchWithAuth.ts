import { refreshToken } from './api';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : typeof options.body === 'object' && options.body !== null
          ? JSON.stringify(options.body)
          : options.body,
    credentials: 'include',
  });

  if (res.status === 401) {
    try {
      const newToken = await refreshToken();

      const retryRes = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      return retryRes;
    } catch (error) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/auth/login';
      throw error;
    }
  }

  return res;
}
