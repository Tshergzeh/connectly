import Image from 'next/image';
import Link from 'next/link';

import { fetchServiceById } from '~/lib/api';
import { ServicePageProps } from '~/shared/types';
import ReviewsSection from './ReviewsSection';
import BookServiceButton from '~/components/services/BookServiceButton';

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await fetchServiceById(params.id);

  if (!service) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Service not found
        </h1>
        <Link href="/services" className="text-primary-600 hover:underline">
          Back to Services
        </Link>
      </section>
    );
  }

  const { id, title, description, price, image, category, average_rating, review_count, created_at } =
    service;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-sm font-medium px-3 py-1 rounded-full">
                {category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Added on {new Date(created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mr-2">
                &#8358;{price}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({Number(average_rating).toFixed(2)} ⭐ from {review_count} reviews)
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <BookServiceButton serviceId={id} price={Number(price)} />
              <Link className="btn btn-outline" href="/services">
                Back to Services
              </Link>
            </div>
          </div>
        </div>

        <ReviewsSection serviceId={params.id} />
      </div>
    </section>
  );
}
