'use client';

import { useEffect, useState } from 'react';

/**
 * ClientOnly component to prevent hydration mismatches
 * This ensures that children only render on the client
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}