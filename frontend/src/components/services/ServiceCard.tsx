'use client';

import Image from 'next/image';
import { Service } from '~/shared/types';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow hover:shadow-lg transition">
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-t-lg">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {service.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            &#8358;{Number(service.price).toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">{service.review_count} reviews</span>
        </div>
      </div>
    </div>
  );
}
