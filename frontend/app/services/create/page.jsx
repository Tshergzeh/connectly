'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
    const { name, type, files, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = sessionStorage.getItem('accessToken');

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('image', form.image);

      await api.post('/services', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Service created successfully!');
      router.push('/services');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create service.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-lg lg:max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
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
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Service Image
            </label>
            <Input
              id="image"
              type="file"
              name="image"
              onChange={handleChange}
              className="block w-full text-sm text-gray-600 border rounded-lg file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto sm:px-8">
            Create Service
          </Button>
        </form>
        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
