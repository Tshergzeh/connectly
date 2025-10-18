'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SignupFormContainer from '~/components/auth/SignupFormContainer';

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      }
    >
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <SignupFormContainer />
      </div>
    </Suspense>
  );
}
