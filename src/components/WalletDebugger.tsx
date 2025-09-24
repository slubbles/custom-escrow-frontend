'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export const WalletDebugger = () => {
  const { wallets } = useWallet();
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded text-sm z-50"
      >
        Debug Wallets
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Available Wallets</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div><strong>Total Wallets:</strong> {wallets.length}</div>
        
        {wallets.map((wallet, index) => (
          <div key={index} className="border-t pt-2">
            <div><strong>Name:</strong> {wallet.adapter.name}</div>
            <div><strong>Ready:</strong> {wallet.adapter.readyState}</div>
            <div><strong>Connected:</strong> {wallet.adapter.connected ? 'Yes' : 'No'}</div>
          </div>
        ))}
        
        <div className="border-t pt-2 text-gray-600">
          <div><strong>WalletConnect Project ID:</strong></div>
          <div className="break-all">
            {process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'Not Set'}
          </div>
        </div>
      </div>
    </div>
  );
};