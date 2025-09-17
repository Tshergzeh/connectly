import api from './api';

export async function createBooking(serviceId) {
  const token = sessionStorage.getItem('accessToken');
  const res = await api.post(`/bookings/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.booking;
}
