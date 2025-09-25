import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Spinner from '../ui/Spinner';
import { updateBookingStatus } from '@/lib/bookings';

export default function BookingCard({ booking, onStatusChange }) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await updateBookingStatus(booking.id, newStatus);
      onStatusChange(booking.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.error || 'Failed to process booking');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 rounded-lg shadow bg-white w-full h-full flex flex-col">
      {loading && <Spinner message="Updating status..." />}
      <h2 className="font-semibold text-lg text-gray-800 break-words">{booking.service.title}</h2>
      <div className="mt-1 text-sm text-gray-600 flex flex-col sm:flex-row sm:flex-wrap sm:gap-2">
        <span>Customer: {booking.customer.name || 'N/A'}</span>
        <span className="truncate">Email: {booking.customer.email || 'N/A'}</span>
      </div>
      <p className="text-indigo-600 font-bold mt-1">&#8358;{booking.service.price}</p>
      <p className="text-gray-500 text-sm mt-1">
        Status:
        <span className="font-semibold text-gray-500 text-sm"> {booking.status}</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Booked on {new Date(booking.created_at).toLocaleDateString()}
      </p>

      <div className="flex-grow" />

      {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
        <div className="flex flex-col sm:flex-row gap-2 mt-3 min-w-[120px]">
          <button
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm"
            onClick={() => handleUpdate('Completed')}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Mark Completed'}
          </button>
          <button
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm"
            onClick={() => handleUpdate('Cancelled')}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
}
