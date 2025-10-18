import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchProviderBookings(cursor?: string, status?: string, limit?: number) {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/bookings/provider`;
    const url = new URL(status ? `${baseUrl}/${status}` : baseUrl);

    if (cursor) url.searchParams.append('cursor', cursor);
    if (limit) url.searchParams.append('limit', limit.toString());

    const res = await fetchWithAuth(url.toString());

    if (!res.ok) throw new Error('Failed to fetch provider bookings');

    return res.json();
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    return { data: [] };
  }
}

export async function updateBookingStatus(bookingId: string, status: 'Completed' | 'Cancelled') {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error('Failed to update booking status');

  return res.json();
}
