'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

import AuthForm from '~/components/auth/AuthForm';
import { loginUser } from '~/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async ({ email, password }: any) => {
    try {
      const { accessToken, user } = await loginUser(email, password);
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('user', JSON.stringify(user));

      window.dispatchEvent(new Event('auth-change'));

      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect');

      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/'); 
      }
    } catch (error: any) {
      console.error('Login failed', error.message);
      throw error;
    }
  };

  return (
    <Suspense fallback={<div className="text-center py-20">Loading form...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </Suspense>
  );
}
