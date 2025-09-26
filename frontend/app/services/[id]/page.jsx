'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import ReviewStars from '@/components/ui/ReviewStars';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/service/${id}`);
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (id) {
      fetchService();
      fetchReviews();
    }
  }, [id]);

  if (!service) {
    return <p className="p-6">Loading service details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 sm:py-10">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6">
        <img
          src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${service.image}`}
          alt={service.title}
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg"
        />
        <h2 className="text-2xl text-gray-800 font-bold">{service.title}</h2>
        <p className="text-gray-600">{service.description}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-indigo-600 font-bold text-xl">&#8358;{service.price}</span>
          <ReviewStars rating={service.rating} />
        </div>
        <Button className="w-full sm:w-auto sm:px-8">Book This Service</Button>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
          {reviews.length > 0 ? (
            <div
              className="
                mt-4 grid gap-4
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {reviews.map((review) => (
                <div
                  key={reviews.id}
                  className="border p-4 rounded-md bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <ReviewStars rating={review.rating} />
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                  <small className="text-gray-500">By User {review.customer_name}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
