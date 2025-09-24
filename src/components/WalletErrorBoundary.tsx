'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AlertTriangle, Wifi, RefreshCw } from 'lucide-react';

interface WalletErrorBoundaryProps {
  children: React.ReactNode;
}

export function WalletErrorBoundary({ children }: WalletErrorBoundaryProps) {
  const { connected, connecting, disconnecting } = useWallet();

  // Handle wallet connection states
  if (connecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-mountain-900 mb-2">Connecting Wallet</h3>
          <p className="text-mountain-600">Please approve the connection in your wallet...</p>
        </div>
      </div>
    );
  }

  if (disconnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mountain-200 border-t-mountain-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-mountain-900 mb-2">Disconnecting Wallet</h3>
          <p className="text-mountain-600">Safely disconnecting your wallet...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Network Error Component
 */
export function NetworkErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  const isNetworkError = error?.message?.includes('network') || 
                        error?.message?.includes('RPC') ||
                        error?.message?.includes('timeout');

  const isContractError = error?.message?.includes('Program') ||
                         error?.message?.includes('Account not found') ||
                         error?.message?.includes('instruction');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {isNetworkError ? (
              <Wifi className="w-8 h-8 text-red-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isNetworkError ? 'Network Error' : 
             isContractError ? 'Contract Error' : 
             'Something went wrong'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isNetworkError ? 
              'Unable to connect to Solana network. Please check your internet connection.' :
             isContractError ?
              'The smart contract may not be deployed or initialized yet.' :
              error?.message || 'An unexpected error occurred.'
            }
          </p>

          <div className="space-y-3">
            {retry && (
              <button
                onClick={retry}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go Home
            </button>
          </div>

          {isContractError && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Admin Note:</strong> The platform may need to be initialized. 
                Visit the admin panel to set up the smart contracts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Wallet Connection Required Component
 */
export function WalletRequired({ message }: { message?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-sky-100 p-8 text-center">
      <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-mountain-900 mb-4">Wallet Connection Required</h2>
      <p className="text-mountain-600 mb-6">
        {message || 'Please connect your Solana wallet to access this feature.'}
      </p>
      <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !rounded-lg !px-6 !py-3 !font-semibold !transition-all !duration-200" />
    </div>
  );
}