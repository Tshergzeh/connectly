'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import api from '@/lib/api';
import ServiceCard from '@/components/cards/ServiceCard';
import SearchBar from '@/components/ui/SearchBar';
import CategoryChip from '@/components/ui/CategoryChip';
import Button from '@/components/ui/Button';

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const fetchServices = async (cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const res = await api.get('/services', {
        params: { limit: 10, cursor },
      });

      setServices((prev) => (cursor ? [...prev, ...res.data.data] : res.data.data));

      setNextCursor(res.data.nextCursor);
    } catch (error) {
      throw new Error('Error fetching services:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = services.filter((s) => {
    return (
      s.title.toLowerCase().includes(query.toLowerCase()) && (!category || s.category === category)
    );
  });

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Services</h1>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="block">
                <ServiceCard service={service} />
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No services found.</p>
          )}
        </div>

        {nextCursor && (
          <div className="flex justify-center mt-6">
            <Button onClick={() => fetchServices(nextCursor)} disabled={loadingMore}>
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
