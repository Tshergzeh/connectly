'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('authChange'));
    router.push('/login');
  };

  return isLoggedIn ? (
    <button
      onClick={handleLogout}
      type='button'
      aria-label='Logout from your account'
      className="text-red-600 hover:text-red-800 w-full text-left text-sm sm:text-base md:w-auto md:text-center"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={() => router.push('/login')}
      type='button'
      aria-label='Login to your account'
      className="text-blue-600 hover:text-blue-800 w-full text-left text-sm sm:text-base md:w-auto md:text-center"
    >
      Login
    </button>
  );
}
