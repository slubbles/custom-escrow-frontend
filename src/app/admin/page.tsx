'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useActiveSales, useInitializeProgram } from '../../hooks/useEscrow';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { Settings, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

export default function AdminPage() {
  const { publicKey, connected } = useWallet();
  const { data: sales, isLoading } = useActiveSales();
  const initializeProgramMutation = useInitializeProgram();
  const { isAdmin } = useAdminAccess();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if program is initialized by looking for any sales data or successful verification
  useEffect(() => {
    if (sales && sales.length > 0) {
      setIsInitialized(true);
    }
  }, [sales]);

  const handleInitialize = async () => {
    try {
      const result = await initializeProgramMutation.mutateAsync();
      if (result.success) {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Initialization failed:', error);
      // Error is already handled by the mutation with toast
    }
  };

  // Handle initialization error state
  const initializationError = initializeProgramMutation.error;
  const hasInitializationError = initializeProgramMutation.isError;

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">
              Please connect your Solana wallet to access the admin panel. 
              Make sure you have some SOL for transaction fees.
            </p>
            <div className="mb-4">
              <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !px-6 !py-3 !text-sm !font-semibold !transition-all !duration-200 !w-full" />
            </div>
            <p className="text-xs text-gray-500">
              Supported wallets: Phantom, Solflare, Backpack, and more
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don&apos;t have permission to access this admin panel.</p>
            <p className="text-sm text-gray-500 mb-6">Connected: {publicKey?.toString()}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Snarbles Admin Panel</h1>
                <p className="text-gray-600">Dev access for {publicKey?.toString()}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  Admin Access
                </div>
                <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !px-4 !py-2 !text-sm !font-semibold !transition-all !duration-200" />
              </div>
            </div>
          </div>

          {/* Initialization Error State */}
          {hasInitializationError && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Initialization Failed</h3>
                  <p className="text-gray-700">
                    {initializationError?.message || 'An error occurred while verifying the smart contract.'}
                  </p>
                  <button
                    onClick={() => initializeProgramMutation.reset()}
                    className="mt-2 text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Smart Contract Initialization */}
          {!isInitialized && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Contract Setup</h2>
                      <p className="text-gray-700 mb-4">
                        Verify your smart contract connectivity and prepare for token sales.
                        This will test the connection to your deployed escrow contract.
                      </p>
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">What this does:</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Verifies smart contract deployment on Solana</li>
                          <li>• Tests wallet connectivity and SOL balance</li>
                          <li>• Checks program accessibility and permissions</li>
                          <li>• Prepares the system for token sale creation</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-6">
                      <button
                        onClick={handleInitialize}
                        disabled={initializeProgramMutation.isPending || isInitialized}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                      >
                        {initializeProgramMutation.isPending ? (
                          <>
                            <Loader className="w-6 h-6 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : isInitialized ? (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            <span>Contract Verified</span>
                          </>
                        ) : (
                          <>
                            <Settings className="w-6 h-6" />
                            <span>Verify Contract</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contract Status */}
          {isInitialized && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Smart Contract Ready!</h2>
                    <p className="text-gray-700">Your escrow contract is verified and ready for token sales.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <a 
                    href="/create" 
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Create Token Sale
                  </a>
                  <a 
                    href="/marketplace" 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View Marketplace
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Sales Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? (
                      <Loader className="w-6 h-6 animate-spin" />
                    ) : (
                      sales?.length || 0
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Management */}
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
              {isInitialized && (
                <a 
                  href="/create"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  + Create New Sale
                </a>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
                <p className="text-gray-600">Loading sales data...</p>
              </div>
            ) : sales && sales.length > 0 ? (
              <div className="space-y-4">
                {sales.map((sale, index) => (
                  <div key={sale.publicKey.toString()} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Token Sale #{index + 1}</h3>
                        <p className="text-sm text-gray-500">Price: {sale.account.pricePerToken.toString()} per token</p>
                        <p className="text-sm text-gray-500">
                          Status: {sale.account.isActive ? 'Active' : 'Inactive'}
                          {sale.account.isPaused && ' (Paused)'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded">
                          View
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800 px-3 py-1 rounded">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 px-3 py-1 rounded">
                          Pause
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">No active sales found</p>
                <p className="text-sm text-gray-500 mb-4">
                  {isInitialized 
                    ? "Create your first token sale to get started" 
                    : "Initialize the contract first to create sales"
                  }
                </p>
                {isInitialized && (
                  <a 
                    href="/create"
                    className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Create First Sale
                  </a>
                )}
              </div>
            )}
          </div>          {/* Admin Actions */}
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                disabled={!isInitialized}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Sale
              </button>
              <button 
                disabled={!isInitialized}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pause All Sales
              </button>
              <button 
                disabled={!isInitialized}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Emergency Stop
              </button>
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Export Data
              </button>
            </div>
            
            {!isInitialized && (
              <p className="text-sm text-gray-500 mt-4">
                Initialize the smart contract first to enable these actions.
              </p>
            )}
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Contract</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Program ID:</span>
                    <span className="text-sm text-gray-900 font-mono">HVpf...rt4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="text-emerald-600 font-medium">Devnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-emerald-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Fees</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee Rate:</span>
                    <span className="text-gray-900 font-medium">3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee Recipient:</span>
                    <span className="text-sm text-gray-900 font-mono">9yWM...ZyPE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Collected:</span>
                    <span className="text-gray-900 font-medium">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}