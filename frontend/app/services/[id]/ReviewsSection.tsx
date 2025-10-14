'use client';

import { useEffect, useState } from 'react';
import { fetchServiceReviews } from '~/lib/api';
import { Review, ReviewsSectionProps } from '~/shared/types';

export default function ReviewsSection({ serviceId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const data = await fetchServiceReviews(serviceId);
      setReviews(data);
      setLoading(false);
    };

    loadReviews();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="mt-10 text-center text-gray-500 dark:text-gray-400">Loading reviews...</div>
    );
  }

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-slate-700 pt-10">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet for this service.</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review: Review) => (
            <li
              key={review.id}
              className="rounded-lg border border-gray-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  {review.customer_name}
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.183c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.463a1 1 0 00-1.175 0l-3.39 2.463c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.042 9.4c-.783-.57-.38-1.81.588-1.81h4.183a1 1 0 00.95-.69l1.286-3.974z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
