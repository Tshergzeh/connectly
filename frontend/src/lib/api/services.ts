import { fetchWithAuth } from '../fetchWithAuth';

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
