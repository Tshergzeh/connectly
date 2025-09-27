'use client';

import { useEffect, useState } from 'react';

import api from '@/lib/api';
import BookingCard from '@/components/cards/BookingCard';
import CategoryChip from '@/components/ui/CategoryChip';
import Button from '@/components/ui/Button';

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProviderBookings = async (cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const token = sessionStorage.getItem('accessToken');

      const res = await api.get('/bookings/provider', {
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

  useEffect(() => {
    fetchProviderBookings();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
  };

  const filtered = Array.isArray(bookings)
    ? bookings.filter((b) => !statusFilter || b.status === statusFilter)
    : [];

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
    <div className="min-h-screen px-4 sm:px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Service Bookings</h1>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-3 md:space-y-0">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
          {['Pending', 'Paid', 'Cancelled', 'Completed'].map((status) => (
            <CategoryChip
              key={status}
              label={status}
              active={statusFilter === status}
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            />
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      {nextCursor && (
        <Button
          className="mt-6 w-full sm:w-auto"
          onClick={() => fetchProviderBookings(nextCursor)}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
}
