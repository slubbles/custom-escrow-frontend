'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useActiveSales } from '../../hooks/useEscrow';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAdminAccess } from '../../hooks/useAdminAccess';

export default function AdminPage() {
  const { publicKey, connected } = useWallet();
  const { data: sales, isLoading } = useActiveSales();
  const { isAdmin } = useAdminAccess();

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
            <p className="text-gray-600 mb-6">Please connect your wallet to access the admin panel.</p>
            <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !px-6 !py-3 !text-sm !font-semibold !transition-all !duration-200" />
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
            <p className="text-gray-600 mb-4">You don't have permission to access this admin panel.</p>
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
                  <p className="text-2xl font-bold text-gray-900">{sales?.length || 0}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Management</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : sales && sales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sale ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Token Mint</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Available</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {sale.publicKey.toString().slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {sale.account.tokenMint.toString().slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {(sale.account.pricePerToken.toNumber() / 1e9).toFixed(4)} SOL
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {(sale.account.tokensAvailable.toNumber() / 1e9).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            sale.account.isActive && !sale.account.isPaused
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {sale.account.isActive && !sale.account.isPaused ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">No active sales found</p>
                <p className="text-sm text-gray-500">Sales will appear here when they are created</p>
              </div>
            )}
          </div>

          {/* Admin Actions */}
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Create Sale
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Pause All Sales
              </button>
              <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                Emergency Stop
              </button>
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Export Data
              </button>
            </div>
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