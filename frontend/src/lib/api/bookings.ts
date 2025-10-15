import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchProviderBookings(cursor?: string, status?: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/bookings/provider`);

  if (cursor) url.searchParams.append('cursor', cursor);

  if (status) url.searchParams.append('status', status);

  const res = await fetchWithAuth(url.toString());

  if (!res.ok) throw new Error('Failed to fetch provider bookings');

  return res.json();
}

export async function updateBookingStatus(bookingId: string, status: 'Completed' | 'Cancelled') {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error('Failed to update booking status');

  return res.json();
}
