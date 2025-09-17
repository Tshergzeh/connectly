'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function LoginPage() {
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
    setMessage('');

    try {
      const loginResponse = await api.post('/auth/login', form, {
        withCredentials: true,
      });
      const { accessToken, user } = loginResponse.data;
      sessionStorage.setItem('accessToken', accessToken);
      setMessage('Login successful!');

      if (user.is_provider && user.is_customer) {
        router.push('/dashboard');
      } else if (user.is_provider) {
        router.push('/bookings/provider');
      } else {
        router.push('/services');
      }
      console.log('User:', user);
    } catch (error) {
      console.error('Login Error:', error);
      setMessage(error.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {message && <p className="text-center text-sm text-gray-600">{message}</p>}

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
