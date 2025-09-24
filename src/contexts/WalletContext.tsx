'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, Adapter } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { clusterApiUrl } from '@solana/web3.js';
import { ClientOnly } from '../components/ClientOnly';

// Import default styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_RPC_URL) {
      return process.env.NEXT_PUBLIC_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => {
      const baseWallets: Adapter[] = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ];

      // Only add WalletConnect if a valid project ID is provided
      const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
      if (walletConnectProjectId && walletConnectProjectId !== 'your-walletconnect-project-id') {
        baseWallets.push(
          new WalletConnectWalletAdapter({
            network: network,
            options: {
              relayUrl: 'wss://relay.walletconnect.com',
              projectId: walletConnectProjectId,
              metadata: {
                name: 'Snarbles',
                description: 'Multi-tiered presale platform for Solana tokens',
                url: typeof window !== 'undefined' ? window.location.origin : 'https://snarbles.com',
                icons: [
                  typeof window !== 'undefined' 
                    ? `${window.location.origin}/favicon.svg`
                    : 'https://snarbles.com/favicon.svg'
                ],
              },
            },
          })
        );
      }

      return baseWallets;
    },
    [network]
  );

  return (
    <ClientOnly>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false}>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ClientOnly>
  );
};