import type { Metadata } from 'next';

import { SITE } from '~/config.js';
import ProviderDashboard from './ProviderDashboard';

export const metadata: Metadata = {
  title: `Provider Dashboard | ${SITE.title}`,
};

export default function Page() {
  return <ProviderDashboard />;
}
