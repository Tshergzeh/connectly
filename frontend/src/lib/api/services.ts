import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchServices(cursor?: string, limit?: number) {
  try {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', limit.toString());

    const url = `${process.env.NEXT_PUBLIC_API_URL}/services${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return { data: [] };
  }
}

export async function createService(formData: FormData) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create service');
  }

  return res.json();
}
