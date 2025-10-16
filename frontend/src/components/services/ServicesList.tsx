'use client';

import { useState } from 'react';
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Available Services
          </h1>

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
                <Link href={`/services/${service.id}`}>
                  <ServiceCard key={service.id} service={service} />
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
