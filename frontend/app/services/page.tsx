import { fetchServices } from '~/lib/api';
import ServiceCard from '~/components/services/ServiceCard';

export default async function ServicesPage() {
  const { data } = await fetchServices();

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Available Services
        </h1>

        {data.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No services available at the moment.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
