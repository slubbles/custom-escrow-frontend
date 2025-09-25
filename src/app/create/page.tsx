'use client';

import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-coral-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-mountain-800 mb-8">Create Token Sale</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-mountain-600 mb-4">
            This create page is under active development as part of Phase 1 implementation.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
