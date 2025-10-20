'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ServicesList from '~/components/services/ServicesList';
import { clientFetchProviderServices } from '~/lib/client-api';
import { ServicesResponse } from '~/shared/types';

export default function ProviderServicesPage() {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initial = await clientFetchProviderServices(undefined, 10);
        setData(initial);
      } catch (error) {
        console.error('Error fetching provider services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
        Failed to load services.
      </div>
    );
  }

  return (
    <ServicesList
      initialData={data}
      initialLimit={10}
      customFetcher={clientFetchProviderServices}
    />
  );
}
