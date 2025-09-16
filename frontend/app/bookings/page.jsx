'use client';

import { useEffect, useState } from "react";

import api from '@/lib/api';
import ReviewStars from "@/components/ui/ReviewStars";
import ReviewForm from '@/components/ReviewForm';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');

                const res = await api.get('/bookings', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const bookingsData = await Promise.all(
                    res.data.map(async (b) => {
                        const serviceRes = await api.get(
                            `/services/${b.service_id}`,
                            { Authorization: `Bearer ${token}` }
                        );
                        return { ...b, service: serviceRes.data };
                    })
                );

                setBookings(bookingsData);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                My Bookings
            </h1>

            {bookings.length === 0 && <p>You haven't booked any services yet.</p>}

            {bookings.map((b) => (
                <div
                    key={b.booking_id}
                    className="p-4 rounded-lg shadow flex items-start gap-4"
                >
                    <img
                        src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${b.service.image}`}
                        alt={b.service.title}
                        className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                        <h2 className="font-semibold text-gray-800">
                            {b.service.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Status: {b.status}
                        </p>
                        <p className="text-indigo-600 font-bold">
                            ${b.service.price}
                        </p>

                        <ReviewForm bookingId={b.id} />
                    </div>
                </div>
            ))}
        </div>
    );
}
