'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const loginResponse = await api.post('/auth/login', form, {
        withCredentials: true,
      });
      const { accessToken, user } = loginResponse.data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChange'));
      setMessage('Login successful!');

      if (user.is_provider) {
        router.push('/provider/bookings');
      } else {
        router.push('/services');
      }
      console.log('User:', user);
    } catch (error) {
      console.error('Login Error:', error);
      setMessage(error.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {loading && <Spinner message="Logging in..." />}
      <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full sm:w-auto sm:px-8" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {message && <p className="text-center text-sm text-gray-600">{message}</p>}

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
