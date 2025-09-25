import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

import ReviewStars from '../ui/ReviewStars';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { createBooking } from '@/lib/bookings';
import { initialisePayment } from '@/lib/payments';

export default function ServiceCard({ service }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);

      const booking = await createBooking(service.id);

      const payment = await initialisePayment({
        bookingId: booking.id,
        amount: service.price,
      });

      window.location.href = payment.authorization_url;
    } catch (error) {
      console.error('Error during booking/payment:', error);
      toast.error(error.response?.data?.error || 'Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {loading && <Spinner message="Processing your booking..." />}
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${service.image}`}
        alt={service.title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-sm text-gray-600">{service.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-indigo-600 font-bold">${service.price}</span>
          <ReviewStars rating={service.average_rating} />
        </div>
        <Button
          className="w-full mt-3 flex items-center justify-center"
          onClick={handleBooking}
          disabled={loading}
        >
          {loading ? 'Booking' : 'Book Now'}
        </Button>
      </div>
    </div>
  );
}
