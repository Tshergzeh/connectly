'use client';

import { useEffect, useState } from 'react';

import api from '@/lib/api';
import BookingCard from '@/components/cards/BookingCard';

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Service Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b) => <BookingCard key={b.id} booking={b} />)
      )}
    </div>
  );
}
