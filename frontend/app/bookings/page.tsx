'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { fetchBookings } from '~/lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBookings = async () => {
      const token = sessionStorage.getItem('token');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const res = await fetchBookings(token);
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
        Loading bookings...
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">You have no bookings yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 hover:shadow-md transition"
              >
                <div className="h-40 w-full mb-4 relative">
                  <Image
                    src={booking.service.image}
                    alt={booking.service.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {booking.service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {booking.service.description}
                </p>
                <p className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                  &#8358;{booking.service.price}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
