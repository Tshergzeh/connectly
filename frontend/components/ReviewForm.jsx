'use client';

import { useState } from "react";

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
                { headers: { Authorization: `Bearer ${token}` }}
            );
            window.location.reload();
        } catch (error) {
            console.error('Error creating review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2 space-y-2">
            <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border rounded px-2 py-1 text-gray-600"
            >
                <option value="0">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>
            <textarea
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded px-2 py- text-gray-600"
            />
            <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    );
}