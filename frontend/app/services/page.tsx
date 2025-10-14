import { fetchServices } from '~/lib/api';
import ServicesList from '~/components/services/ServicesList';

export default async function ServicesPage() {
  const initialData = await fetchServices();

  return <ServicesList initialData={initialData} />;
}
