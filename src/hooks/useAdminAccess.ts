'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

const ADMIN_WALLET = 'CjXdet5krPipwcW5q2Ki23EDS1kxkFf1NapofyMqoZv1';

export function useAdminAccess() {
  const { publicKey } = useWallet();

  const isAdmin = useMemo(() => {
    return publicKey?.toString() === ADMIN_WALLET;
  }, [publicKey]);

  return {
    isAdmin,
    adminWallet: ADMIN_WALLET,
  };
}