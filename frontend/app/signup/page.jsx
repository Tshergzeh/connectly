'use client';

import { useState } from 'react';
import axios from 'axios';
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
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="is_provider"
              checked={form.is_provider}
              onChange={handleChange}
            />
            Sign up as Provider
          </label>
        </div>

        <div>
          <label>
            <input 
                type="checkbox" 
                name="is_customer" 
                checked={form.is_customer}
                onChange={handleChange} />
            Sign up as Customer
          </label>
        </div>

        <button type="submit">Signup</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
