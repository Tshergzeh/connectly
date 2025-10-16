'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { fetchBookings, deleteBooking, createReview } from '~/lib/api';
import StatusBadge from '~/components/bookings/StatusBadge';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
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
        setNextCursor(res.nextCursor || null);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [router]);

  const handleLoadMore = async () => {
    const token = sessionStorage.getItem('token');

    if (!token || !nextCursor) return;

    try {
      const res = await fetchBookings(token, nextCursor);
      setBookings(prev => [...prev, ...res.data]);
      setNextCursor(res.nextCursor || null);
    } catch (error) {
      console.error('Error loading more bookings:', error);
    }
  };

  const handleDelete = async (bookingId: string) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await deleteBooking(bookingId, token);
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking.');
    }
  };

  const handleReviewSubmit = async (bookingId: string) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      await createReview(bookingId, rating, comment, token);
      toast.success('Review submitted successfully');
      setShowReviewForm(null);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review.');
    }
  };

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
          <>
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
                    &#8358;{Number(booking.service.price).toLocaleString()}
                  </p>
                  <StatusBadge status={booking.status} />

                  {booking.status === 'Pending' && (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="mt-3 w-full text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition py-1 rounded"
                    >
                      Delete Booking
                    </button>
                  )}

                  {booking.status === 'Completed' && !booking.review && (
                    <button
                      onClick={() => setShowReviewForm(booking.id)}
                      className="mt-3 w-full text-sm text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white transition py-1 rounded"
                    >
                      Add Review
                    </button>
                  )}

                  {showReviewForm === booking.id && (
                    <div className="mt-3 space-y-2">
                      <select
                        value={rating}
                        onChange={e => setRating(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
                      >
                        <option value={0}>Select Rating</option>
                        {[1, 2, 3, 4, 5].map(r => (
                          <option key={r} value={r}>
                            {r} Star{r > 1 && 's'}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReviewSubmit(booking.id)}
                          className="flex-1 bg-indigo-600 text-white rounded py-1 hover:bg-indigo-700 transition text-sm"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setShowReviewForm(null)}
                          className="flex-1 border border-gray-400 rounded py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {nextCursor && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
