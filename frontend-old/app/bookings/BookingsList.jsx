'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

import api from '@/lib/api';
import ReviewStars from '@/components/ui/ReviewStars';
import ReviewForm from '@/components/ReviewForm';
import Button from '@/components/ui/Button';

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const fetchBookings = async (cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const token = sessionStorage.getItem('accessToken');

      const res = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10, cursor },
      });

      setBookings((prev) => (cursor ? [...prev, ...res.data.data] : res.data.data));

      setNextCursor(res.data.nextCursor);
    } catch (error) {
      throw new Error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      await api.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Booking deleted successfully');
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error deleting booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">You haven't booked any services yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bookings.map((b) => (
          <div key={b.id} className="p-4 rounded-lg shadow flex flex-col bg-white">
            <Image
              src={b.service.image}
              alt={b.service.title}
              width={400}
              height={160}
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                25vw"
            />
            <h2 className="font-semibold text-gray-800 mt-3">{b.service.title}</h2>
            <p className="text-sm text-gray-600">Status: {b.status}</p>
            <p className="text-indigo-600 font-bold">&#8358;{b.service.price}</p>

            {b.review ? (
              <div className="mt-2">
                <ReviewStars rating={b.review.rating} />
                <p className="text-gray-700 text-sm mt-1">{b.review.comment}</p>
                <p className="text-xs text-gray-500">
                  Reviewed on {new Date(b.review.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : b.status === 'Completed' ? (
              <ReviewForm bookingId={b.id} />
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                You can leave a review once the booking has been completed.
              </p>
            )}

            {b.status === 'Pending' && (
              <Button
                className="mt-2 bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDelete(b.id)}
              >
                Delete Booking
              </Button>
            )}
          </div>
        ))}
      </div>

      {nextCursor && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => fetchBookings(nextCursor)} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
