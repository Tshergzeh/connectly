'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CreateServicePage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

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
      const token = sessionStorage.getItem('accessToken');
      await api.post('/services', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Service created successfully!');
      router.push('/services');
    } catch (error) {
      console.error('Error creating service:', error);
      setMessage(error.response?.data?.error || 'Failed to create service.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create a Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" name="title" value={form.title} onChange={handleChange} />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            label="Price"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
          <Input label="Category" name="category" value={form.category} onChange={handleChange} />
          <Input label="Image URL" name="image" value={form.image} onChange={handleChange} />
          <Button type="submit" className="w-full">
            Create Service
          </Button>
        </form>
        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
