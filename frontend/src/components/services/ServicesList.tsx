'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Service, ServicesResponse } from '~/shared/types';
import ServiceCard from '~/components/services/ServiceCard';
import { clientFetchServices } from '~/lib/client-api';

export default function ServicesList({
  initialData,
  initialLimit = 10,
}: {
  initialData: ServicesResponse;
  initialLimit?: number;
}) {
  const [services, setServices] = useState<Service[]>(initialData.data);
  const [nextCursor, setNextCursor] = useState<string | null>(initialData.nextCursor);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    ratingMin: undefined as number | undefined,
  });

  const handleFilterApply = async () => {
    setLoading(true);

    try {
      const { data, nextCursor: newCursor } = await clientFetchServices(undefined, limit, filters);
      setServices(data);
      setNextCursor(newCursor);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data, nextCursor: newCursor } = await clientFetchServices(undefined, limit);
        setServices(data);
        setNextCursor(newCursor);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  const loadMore = async () => {
    if (!nextCursor) return;
    setLoading(true);

    try {
      const { data, nextCursor: newCursor } = await clientFetchServices(nextCursor, limit);
      setServices((prev: Service[]) => [...prev, ...data]);
      setNextCursor(newCursor);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8 w-full">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Services</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search services.."
              value={filters.keyword}
              onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-100 w-full sm:w-64"
            />

            <select
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="home">Home</option>
              <option value="fitness">Fitness</option>
              <option value="education">Education</option>
              <option value="tech">Tech</option>
            </select>

            <input
              type="number"
              placeholder="Min price"
              value={filters.priceMin || ''}
              onChange={e =>
                setFilters({
                  ...filters,
                  priceMin: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-100 w-28"
            />

            <input
              type="number"
              placeholder="Max price"
              value={filters.priceMax || ''}
              onChange={e =>
                setFilters({
                  ...filters,
                  priceMax: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-100 w-28"
            />

            <select
              value={filters.ratingMin || ''}
              onChange={e =>
                setFilters({
                  ...filters,
                  ratingMin: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Min Rating</option>
              {[1, 2, 3, 4, 5].map(rating => (
                <option value={rating} key={rating}>
                  {rating}+
                </option>
              ))}
            </select>

            <button
              onClick={handleFilterApply}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Filtering...' : 'Apply'}
            </button>
          </div>

          <div className="mt-4 sm:mt-0">
            <label className="text-gray-700 dark:text-gray-300 mr-2">Per page:</label>
            <select
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
              className="border border-gray-300 rounded-md-px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
            >
              {[5, 10, 15, 20, 25].map(size => (
                <option value={size} key={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {services.length === 0 && !loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No services available at the moment.
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service: any) => (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <ServiceCard service={service} />
                </Link>
              ))}
            </div>

            {nextCursor && (
              <div className="mt-8 text-center">
                <button
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  onClick={loadMore}
                >
                  {loading ? 'Loading' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
