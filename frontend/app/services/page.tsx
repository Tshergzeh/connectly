'use client';
export const dynamic = 'force-dynamic';

import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import { fetchServices } from '~/lib/api/services';
import ServicesList from '~/components/services/ServicesList';

export default async function ServicesPage() {
  const limit = 10;
  const initialData = await fetchServices(undefined, limit);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      }
    >
      <ServicesList initialData={initialData} initialLimit={limit} />;
    </Suspense>
  );
}
