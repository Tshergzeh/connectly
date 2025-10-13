"use client";

import { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => void;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCustomer, setIsCustomer] = useState(true);
  const [isProvider, setIsProvider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'login') {
        await onSubmit({ email, password });
      } else {
        await onSubmit({ name, email, password, isCustomer, isProvider });
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'
      >
        {type === "login" ? "Welcome back" : "Create an account"}
      </h2>

      <div className='space-y-4'>
        {type === 'signup' && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100 focus:border-indigo-500 focus:outline-none"
            />

            <div className="flex flex-col gap-3 mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isCustomer}
                  onChange={e => setIsCustomer(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span>I want to be a Customer</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isProvider}
                  onChange={e => setIsProvider(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span>I want to be a Service Provider</span>
              </label>
            </div>
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100 focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {error && 
        <p className="text-sm font-medium text-red-500 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </p>
      }

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
}
