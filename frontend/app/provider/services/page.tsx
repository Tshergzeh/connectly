import type { Metadata } from 'next';

import { SITE } from '~/config.js';
import ProviderServicesPage from './ProviderServicesPage';

export const metadata: Metadata = {
  title: `My Services | ${SITE.title}`,
};

export default function Page() {
  return <ProviderServicesPage />;
}
