'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the create project page
    router.replace('/create-project');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-landscape">
      <div className="text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">+</span>
        </div>
        <div className="text-2xl font-bold text-white mb-4">
          Redirecting to Project Creation...
        </div>
        <p className="text-white/80">
          Taking you to the project launch page
        </p>
      </div>
    </div>
  );
}