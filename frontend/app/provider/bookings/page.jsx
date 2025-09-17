'use client';

import { useEffect, useState } from 'react';

import api from '@/lib/api';
import BookingCard from '@/components/cards/BookingCard';
import CategoryChip from '@/components/ui/CategoryChip';

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchProviderBookings = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        const res = await api.get('/bookings/provider', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching provider booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderBookings();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
  };

  const filtered = bookings.filter((b) => {
    return !statusFilter || b.status === statusFilter;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Service Bookings</h1>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-3 md:space-y-0">
        <div className="flex space-x-2">
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
        <p>No bookings yet.</p>
      ) : (
        filtered.map((b) => (
          <BookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
        ))
      )}
    </div>
  );
}
