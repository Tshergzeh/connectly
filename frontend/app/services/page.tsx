import { fetchServices } from '~/lib/api/services';
import ServicesList from '~/components/services/ServicesList';

export default async function ServicesPage() {
  const limit = 10;
  const initialData = await fetchServices(undefined, limit);
  return <ServicesList initialData={initialData} initialLimit={limit} />;
}
