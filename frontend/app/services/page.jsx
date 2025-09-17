'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ServiceCard from '@/components/cards/ServiceCard';
import SearchBar from '@/components/ui/SearchBar';
import CategoryChip from '@/components/ui/CategoryChip';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const filtered = services.filter((s) => {
    return (
      s.title.toLowerCase().includes(query.toLowerCase()) && (!category || s.category === category)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Services</h1>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-3 md:space-y-0">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex space-x-2">
          {['Home Repair', 'Cleaning', 'Tutoring', 'Technology'].map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={category === cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((service) => <ServiceCard key={service.id} service={service} />)
        ) : (
          <p className="text-gray-500">No services found.</p>
        )}
      </div>
    </div>
  );
}
