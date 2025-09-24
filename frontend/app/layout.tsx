'use client';

import Link from 'next/link';
import './globals.css';
import { useState, useEffect, ReactNode } from 'react';

import AuthButton from '@/components/AuthButton';

type User = {
  id: string;
  name: string;
  email: string;
  hashed_password: string;
  is_provider: boolean;
  is_customer: boolean;
  created_at: string;
  updated_at: string;
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = sessionStorage.getItem('user');
      setUser(storedUser ? (JSON.parse(storedUser) as User) : null);
    };

    loadUser();
    window.addEventListener('authChange', loadUser);
    return () => window.removeEventListener('authChange', loadUser);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Connectly - Service Booking Platform</title>
      </head>
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white shadow px-6 py-4 flex justify-between">
          <Link href="/" className="font-bold text-indigo-600">
            Connectly
          </Link>
          <div className="space-x-4">
            {user?.is_customer && (
              <>
                <Link href="/services" className="text-gray-600">
                  Services
                </Link>
                <Link href="/bookings" className="text-gray-600">
                  My Bookings
                </Link>
              </>
            )}

            {user?.is_provider && (
              <>
                <Link href="/services/create" className="text-gray-600">
                  Create Service
                </Link>
                <Link href="/provider/bookings" className="text-gray-600">
                  Provider Dashboard
                </Link>
              </>
            )}

            <AuthButton />
          </div>
        </nav>
        <main className="px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
