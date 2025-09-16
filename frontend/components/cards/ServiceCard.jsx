import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ReviewStars from '../ui/ReviewStars';
import Button from '../ui/Button';
import { createBooking } from '@/lib/bookings';

export default function ServiceCard({ service }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);
      await createBooking(service.id);
      alert('Booking created successfully');
      // redirect to payments page
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${service.image}`}
        alt={service.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-sm text-gray-600">{service.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-indigo-600 font-bold">${service.price}</span>
          <ReviewStars rating={service.average_rating} />
        </div>
        <Button className="w-full mt-3" onClick={handleBooking} disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </Button>
      </div>
    </div>
  );
}
