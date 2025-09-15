'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the SNRB token sale page since this is a single-token platform
    router.replace('/sale/snrb');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-mountain-900 mb-4">
          Redirecting to $SNRB Token Sale...
        </div>
        <p className="text-mountain-600 mb-6">
          Snarbles is focused on the $SNRB token sale only.
        </p>
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}