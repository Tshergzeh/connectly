'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import api from '@/lib/api';

export default function PaymentCallback({ searchParams }) {
  const router = useRouter();
  const { reference, bookingId } = searchParams;

  useEffect(() => {
    if (reference && bookingId) {
      const verifyPayment = async () => {
        try {
          await api.post('/payments/verify', { reference, bookingId });
          alert('Payment successfully verified');
          router.push('/bookings');
        } catch (error) {
          alert('Payment verification failed');
          router.push('/services');
          throw new Error(error);
        }
      };

      verifyPayment();
    }
  }, [reference, bookingId, router]);

  return <p>Verifying payment...</p>;
}
