'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/auth/login');
  }, [router]);

  return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
    </div>
  );
}
