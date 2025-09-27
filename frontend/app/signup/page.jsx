'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import api from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    is_provider: false,
    is_customer: false,
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      setLoading(true);
      await api.post('/auth/signup', form);
      toast.success('Signup successful! Please log in.');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {loading && <Spinner message="Logging in..." />}
      <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="fullName" className="sr-only">
            Full Name
          </label>
          <Input 
            id="fullName"
            name="name" 
            value={form.name} 
            placeholder="Full Name"
            onChange={handleChange} 
          />
          
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Input
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className='relative'>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_provider"
                checked={form.is_provider}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-600">I am a Service Provider</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_customer"
                checked={form.is_customer}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-600">I am a Customer</span>
            </label>
          </div>

          <Button type="submit" className="w-full sm:w-auto sm:px-8">
            Sign Up
          </Button>
        </form>
        {message && (
          <p
            className={`text-center text-sm ${
              message.includes('failed') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center sm:text-left text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
