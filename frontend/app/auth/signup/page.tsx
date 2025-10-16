'use client';

import { Suspense } from 'react';
import toast from 'react-hot-toast';

import AuthForm from '~/components/auth/AuthForm';
import { signupUser } from '~/lib/api';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async ({ name, isCustomer, isProvider, email, password }: any) => {
    try {
      await signupUser(name, email, password, isCustomer, isProvider);
      toast.success('Account created successfully! Please log in.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Signup failed', error.message);
      throw error;
    }
  };

  return (
    <Suspense fallback={<div className="text-center py-20">Loading form...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <AuthForm type="signup" onSubmit={handleSignup} />
      </div>
    </Suspense>
  );
}
