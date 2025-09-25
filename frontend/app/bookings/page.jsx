'use client';

import { useEffect, useState } from 'react';

import api from '@/lib/api';
import ReviewStars from '@/components/ui/ReviewStars';
import ReviewForm from '@/components/ReviewForm';
import Button from '@/components/ui/Button';

export default function BookingsPage() {
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
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">You haven't booked any services yet.</p>
      )}

      {bookings.map((b) => (
        <div key={b.id} className="p-4 rounded-lg shadow flex items-start gap-4 mt-3">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${b.service.image}`}
            alt={b.service.title}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800">{b.service.title}</h2>
            <p className="text-sm text-gray-600">Status: {b.status}</p>
            <p className="text-indigo-600 font-bold">${b.service.price}</p>

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
          </div>
        </div>
      ))}

      {nextCursor && (
        <Button
          className="mt-4"
          onClick={() => fetchBookings(nextCursor)}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
}
