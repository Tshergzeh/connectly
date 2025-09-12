'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    is_provider: false,
    is_customer: false,
  });
  const [message, setMessage] = useState('');

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
      const signupResponse = await api.post('/auth/signup', form);
      setMessage('Signup successful! Please log in.');
      console.log('Response:', signupResponse.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Signup failed');
      console.error('Error:', error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            label='Full Name'
            name='name'
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label='Email'
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label='Password'
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
          />

          <div className='flex items-center space-x-4'>
            <label className='flex items-center space-x-2'>
              <input
                type="checkbox"
                name="is_provider"
                checked={form.is_provider}
                onChange={handleChange}
              />
              <span className='text-sm text-gray-600'>I am a Service Provider</span>
            </label>
            <label className='flex items-center space-x-2'>
              <input
                type="checkbox"
                name="is_customer"
                checked={form.is_customer}
                onChange={handleChange}
              />
              <span className='text-sm text-gray-600'>I am a Customer</span>
            </label>
          </div>

          <Button type='submit' className='w-full'>
            Sign Up
          </Button>
        </form>
        {message && (
          <p className='text-center text-sm text-gray-600'>{message}</p>
        )}

        <p className='text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <a href="/login" className='text-indigo-600 hover:underline'>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
