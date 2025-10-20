import type { Metadata } from 'next';

import { SITE } from '~/config.js';
import ServicesPage from './ServicesPage';

export const metadata: Metadata = {
  title: `Services | ${SITE.title}`,
};

export default function Page() {
  return <ServicesPage />;
}
