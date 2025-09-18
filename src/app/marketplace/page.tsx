'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketplaceRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main one-page SNRB token sale
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-landscape rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <div className="text-2xl font-bold text-mountain-900 mb-4">
          Redirecting to $SNRB Token Sale...
        </div>
        <p className="text-mountain-600 mb-6">
          Experience our streamlined one-page token sale platform.
        </p>
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}