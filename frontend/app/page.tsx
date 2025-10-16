import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { SITE } from '~/config.js';

export const metadata: Metadata = {
  title: SITE.title,
};

export default function Page() {
  return (
    <main className="flex flex-col">
      <section className="relative flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-16 py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-xl text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Find Trusted Professionals for Your Next Project
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with skilled service providers and get your tasks done efficiently. Whatever you
            need: from construction to design and more.
          </p>
          <div className="flex justify-center lg:justify-start gap-4 mt-6">
            <Link
              href="/services"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colours"
            >
              Browse Services
            </Link>
            <Link
              href="/auth/signup?role=provider"
              className="border border-gray-300 px-6 py-3 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Become a Service Provider
            </Link>
          </div>
        </div>

        <div className="relative w-full lg:w-[500px] h-[300px] lg:h-[400px] mb-10 lg:mb-0">
          <Image
            src="https://res.cloudinary.com/dyjnlmskt/image/upload/v1760634897/person-office-work-day_iozicd.jpg"
            alt="Professional services"
            fill
            priority
            className="object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      <section className="py-20 bg-white px-6 lg:px-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="text-blue-600 text-4xl font-bold">1</div>
            <h3 className="text-xl font-semibold">Find a Service</h3>
            <p className="text-gray-600">
              Browse through a wide range of verified service providers suited to your needs.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-blue-600 text-4xl font-bold">2</div>
            <h3 className="text-xl font-semibold">Book with Ease</h3>
            <p className="text-gray-600">
              Book your preferred service directly from our platform with just a few clicks.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-blue-600 text-4xl font-bold">3</div>
            <h3 className="text-xl font-semibold">Get It Done</h3>
            <p className="text-gray-600">
              Relax while professionals handle your task efficiently and on-time.
            </p>
          </div>
        </div>
      </section>

      <div className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and providers using our platform to connect and
          collaborate.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/services"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Explore Services
          </Link>
          <Link
            href="/auth/signup"
            className="border border-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
