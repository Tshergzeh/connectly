import { refreshToken } from './api';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem('token');

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
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
            window.location.href = '/auth/login';
            throw error;
        }
    }

    return res;
}