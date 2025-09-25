'use client';

import Link from 'next/link';
import './globals.css';
import { useState, useEffect, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

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
  const [menuOpen, setMenuOpen] = useState(false);

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
        <nav className="bg-white shadow px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-indigo-600 text-lg sm:text-xl">
            Connectly
          </Link>

          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden md:flex space-x-4 items-center">
            {user?.is_customer && (
              <>
                <Link href="/services" className="text-gray-600 hover:text-indigo-600">
                  Services
                </Link>
                <Link href="/bookings" className="text-gray-600 hover:text-indigo-600">
                  My Bookings
                </Link>
              </>
            )}

            {user?.is_provider && (
              <>
                <Link href="/services/create" className="text-gray-600 hover:text-indigo-600">
                  Create Service
                </Link>
                <Link href="/provider/bookings" className="text-gray-600 hover:text-indigo-600">
                  Provider Dashboard
                </Link>
              </>
            )}

            <AuthButton />
          </div>

          {menuOpen && (
            <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden flex flex-col space-y-2 px-4 py-3 z-50">
              {user?.is_customer && (
                <>
                  <Link
                    href="/services"
                    className="text-gray-600 hover:text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    href="/bookings"
                    className="text-gray-600 hover:text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                </>
              )}

              {user?.is_provider && (
                <>
                  <Link
                    href="/services/create"
                    className="text-gray-600 hover:text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create Service
                  </Link>
                  <Link
                    href="/provider/bookings"
                    className="text-gray-600 hover:text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Provider Dashboard
                  </Link>
                </>
              )}

              <AuthButton />
            </div>
          )}
        </nav>
        <main className="px-6 py-10">{children}</main>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
