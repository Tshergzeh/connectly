import type { Metadata } from 'next';

import { SITE } from '~/config.js';
import BookingsPage from './BookingsPage';

export const metadata: Metadata = {
  title: `Bookings | ${SITE.title}`,
};

export default function Page() {
  return <BookingsPage />;
}
