'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  const reference = searchParams.get('reference');
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference || !bookingId) return;

      try {
        const token = sessionStorage.getItem('token');

        if (!token) {
          router.push('/auth/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reference, bookingId }),
        });

        if (!res.ok) throw new Error('Payment verification failed');

        setStatus('success');
        toast.success('Payment verified successfully');

        setTimeout(() => router.push('/bookings'), 1500);
      } catch (error) {
        console.error('Payment verification failed:', error);
        setStatus('failed');
        toast.error('Payment verification failed');
        setTimeout(() => router.push('/success'), 2000);
      }
    };

    verifyPayment();
  }, [reference, bookingId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-bg-gray-50 dark:bg-gray-900 px-4">
      {status === 'loading' && (
        <>
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-700 dark:text-gray-300 text-lg">Verifying your payment...</p>
        </>
      )}

      {status === 'success' && (
        <div className="text-center">
          <p className="text-2xl font-semibold text-green-600 mb-2">Payment verified</p>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to your bookings...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="text-center">
          <p className="text-2xl font-semibold text-red-600 mb-2">Payment failed</p>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to available services...</p>
        </div>
      )}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
