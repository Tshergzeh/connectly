'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    sessionStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('authChange'));
    router.push('/login');
  };

  return isLoggedIn ? (
    <button onClick={handleLogout} className="text-red-600 hover-underline">
      Logout
    </button>
  ) : (
    <button onClick={() => router.push('/login')} className="text-blue-600">
      Login
    </button>
  );
}
