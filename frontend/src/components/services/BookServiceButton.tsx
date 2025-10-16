'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createBooking, initialisePayment } from '~/lib/api';

export default function BookServiceButton({
  serviceId,
  price,
}: {
  serviceId: string;
  price: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');

      if (!token) {
        const currentPath = `/services/${serviceId}`;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      const bookingRes = await createBooking(serviceId, token);
      const bookingId = bookingRes.booking.id;

      const paymentRes = await initialisePayment(bookingId, price, token);

      window.location.href = paymentRes.authorization_url;
    } catch (error) {
      console.error('Booking failed:', error);
      alert('An error occured while creating your booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={loading} onClick={handleBooking} className="btn btn-primary">
      {loading ? 'Processing...' : 'Book Now'}
    </button>
  );
}
