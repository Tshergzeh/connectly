import api from './api';

export async function initialisePayment({ bookingId, amount }) {
  const res = await api.post('/payments/initialise', {
    bookingId,
    amount,
  });
  return res.data;
}
