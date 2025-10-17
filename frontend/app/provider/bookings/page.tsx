'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchProviderBookings, updateBookingStatus } from '~/lib/api/bookings';
import StatusBadge from '~/components/bookings/StatusBadge';
import { Booking } from '~/shared/types';

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [nextCursor, setNextCursor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    loadBookings();
  }, [statusFilter, limit]);

  async function loadBookings(loadMore = false) {
    setLoading(true);

    try {
      const data = await fetchProviderBookings(
        loadMore ? nextCursor : undefined,
        statusFilter,
        limit,
      );

      if (loadMore) {
        setBookings(prev => [...prev, ...data.data]);
      } else {
        setBookings(data.data);
      }

      setNextCursor(data.nextCursor || null);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(bookingId: string, newStatus: 'Completed' | 'Cancelled') {
    setUpdatingId(bookingId);

    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking,
        ),
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Provider Dashboard</h1>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Bookings</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="flex items-center space-x-2">
            <label className="text-gray-700 dark:text-gray-300 text-sm">Per page:</label>
            <select
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {[5, 10, 15, 20, 25].map(size => (
                <option value={size} key={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && !bookings.length ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map(booking => (
                <tr className="text-gray-800 dark:text-gray-100" key={booking.id}>
                  <td className="px-4 py-3">{booking.service.title}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{booking.customer.name}</p>
                      <p className="text-xs text-gray-500">{booking.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    &#8358;{Number(booking.service.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{booking.payment_id}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3">{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {booking.status === 'Paid' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'Completed')}
                          disabled={updatingId === booking.id}
                          className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md disabled-opacity-50"
                        >
                          {updatingId === booking.id ? 'Updating...' : 'Mark Completed'}
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                          disabled={updatingId === booking.id}
                          className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md disabled-opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {!bookings.length && !loading && (
                <tr>
                  <td className="text-center py-10 text-gray-500" colSpan={7}>
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {nextCursor && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => loadBookings(true)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
