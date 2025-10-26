import type { Metadata } from 'next';

import { SITE } from '~/config.js';
import NewServicePage from './NewServicePage';

export const metadata: Metadata = {
  title: `Create Service | ${SITE.title}`,
};

export default function Page() {
  return <NewServicePage />;
}
