'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { User } from '@/types';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderCTA = () => {
    if (!user) {
      return (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-700 transition"
          >
            Sign Up
          </button>
        </div>
      );
    }

    if (user.is_provider) {
      return (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/provider/bookings')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Provider Dashboard
          </button>
          <button
            onClick={() => router.push('/services/create')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-700 transition"
          >
            Create Service
          </button>
        </div>
      );
    }

    if (user.is_customer) {
      return (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/services')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Browse Services
          </button>
          <button
            onClick={() => router.push('/bookings')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-700 transition"
          >
            My Bookings
          </button>
        </div>
      );
    }

    return null;
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 text-center">
          Welcome to Connectly
        </h1>
        <p className="mt-4 text-gray-600 text-center max-w-xl px-4 sm:px-0">
          Book services, leave reviews, and manage your bookings.
        </p>

        {renderCTA()}
      </div>
    </div>
  );
}
