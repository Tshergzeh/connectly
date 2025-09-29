import Image from 'next/image';

import ReviewStars from '../ui/ReviewStars';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <Image
        src={service.image}
        alt={service.title}
        width={400}
        height={160}
        className="w-full h-48 object-cover"
        unoptimized
      />
      <div className="p-4">
        <h3 className="text-lg text-gray-800 font-semibold">{service.title}</h3>
        <p className="text-sm text-gray-600">{service.description}</p>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-3">
          <span className="text-indigo-600 font-bold">&#8358;{service.price}</span>
          <ReviewStars rating={service.average_rating} />
        </div>
        <Button className="w-full mt-3 flex items-center justify-center">More Info</Button>
      </div>
    </div>
  );
}
