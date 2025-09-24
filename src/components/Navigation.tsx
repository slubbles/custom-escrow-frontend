'use client';

import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Plus, TrendingUp } from 'lucide-react';

export function Navigation() {
  const { connected } = useWallet();

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-cream-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-landscape rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-mountain-900 group-hover:text-sky-600 transition-colors">TokenSale</span>
              <span className="text-xs text-mountain-500 -mt-1">Platform</span>
            </div>
          </Link>

          {/* Simple Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/projects"
              className="text-mountain-600 hover:text-sky-600 hover:bg-sky-50 transition-all duration-200 font-medium inline-flex items-center px-4 py-2 rounded-xl group"
            >
              <TrendingUp className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Browse Sales
            </Link>
            
            {connected && (
              <Link 
                href="/create-project"
                className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                Launch Token Sale
              </Link>
            )}
            
            {/* Wallet Connection */}
            <WalletMultiButton className="!bg-white !border-2 !border-sky-200 !text-sky-700 hover:!bg-sky-50 hover:!border-sky-300 !rounded-xl !font-medium !transition-all !duration-200 !shadow-sm hover:!shadow-md !px-4 !py-2.5" />
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link 
              href="/projects"
              className="text-mountain-600 hover:text-sky-600 transition-colors p-2 rounded-xl hover:bg-sky-50"
            >
              <TrendingUp className="w-5 h-5" />
            </Link>
            <WalletMultiButton className="!bg-sky-600 !text-white !rounded-xl !font-medium !text-sm !px-3 !py-2" />
          </div>
        </div>
      </div>
    </nav>
  );
}