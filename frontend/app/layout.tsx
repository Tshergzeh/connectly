'use client';

import Link from 'next/link';
import './globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    window.location.href = '/login';
  };
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white shadow px-6 py-4 flex justify-between">
          <Link href="/" className="font-bold text-indigo-600">
            Connectly
          </Link>
          <div className="space-x-4">
            <Link href="/services" className="text-gray-600">
              Services
            </Link>
            <Link href="/bookings" className="text-gray-600">
              My Bookings
            </Link>
            {loggedIn ? (
              <button onClick={handleLogout} className="text-red-600 hover:underline">
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-gray-600">
                Login
              </Link>
            )}
          </div>
        </nav>
        <main className="px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
