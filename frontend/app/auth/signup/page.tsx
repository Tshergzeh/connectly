'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import SignupFormContainer from '~/components/auth/SignupFormContainer';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading form...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <SignupFormContainer />
      </div>
    </Suspense>
  );
}
