'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import ReviewStars from '@/components/ui/ReviewStars';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };
    if (id) fetchService();
  }, [id]);

  if (!service) {
    return <p className="p-6">Loading service details...</p>;
  }
  console.log(service);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h2 className="text-2xl font-bold">{service.title}</h2>
        <p className="text-gray-600">{service.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold text-xl">${service.price}</span>
          <ReviewStars rating={service.rating} />
        </div>
        <Button className="w-full">Book This Service</Button>
      </div>
    </div>
  );
}
