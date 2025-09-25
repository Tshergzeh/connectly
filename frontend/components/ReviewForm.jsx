'use client';

import { useState } from 'react';

import api from '@/lib/api';
import Button from '@/components/ui/Button';

export default function ReviewForm({ bookingId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('accessToken');
      await api.post(
        '/reviews',
        { bookingId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (error) {
      console.error('Error creating review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:flex-col sm:gap-3">
      <label htmlFor='rating' className='sr-only'>Rating</label>
      <select
        value={rating}
        id='rating'
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base text-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="0">Select rating</option>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <label htmlFor='comment' className='sr-only'>Comment</label>
      <textarea
        id='comment'
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 resize-none sm:resize"
        rows={3}
      />

      <Button type="submit" disabled={submitting} aria-busy={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
