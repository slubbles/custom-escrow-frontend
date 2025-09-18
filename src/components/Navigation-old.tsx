'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAdminAccess } from '../hooks/useAdminAccess';

export function Navigation() {
  const { connected, publicKey } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAdminAccess();

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-mountain rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-gradient-landscape">Snarbles</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/sale/snrb" 
              className="text-mountain-700 hover:text-forest-600 transition-colors font-medium"
            >
              Buy $SNRB
            </Link>
            <a 
              href="https://snarbles.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mountain-700 hover:text-forest-600 transition-colors font-medium"
            >
              Snarbles.xyz
            </a>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-red-600 hover:text-red-700 transition-colors font-medium flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin</span>
              </Link>
            )}
          </div>
          
          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {connected && publicKey && (
              <div className="text-sm text-mountain-600">
                {formatWalletAddress(publicKey.toString())}
              </div>
            )}
            <WalletMultiButton className="!bg-gradient-mountain hover:!opacity-90 !rounded-lg !px-6 !py-3 !text-sm !font-semibold !transition-all !duration-200" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-mountain-700" />
            ) : (
              <Menu className="w-6 h-6 text-mountain-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/sale/snrb" 
                className="text-mountain-700 hover:text-forest-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy $SNRB
              </Link>
              <a 
                href="https://snarbles.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mountain-700 hover:text-forest-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Snarbles.xyz
              </a>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="text-red-600 hover:text-red-700 transition-colors font-medium py-2 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin Panel</span>
                </Link>
              )}
              <div className="pt-4 border-t border-white/20">
                {connected && publicKey && (
                  <div className="text-sm text-mountain-600 mb-4">
                    {formatWalletAddress(publicKey.toString())}
                  </div>
                )}
                <WalletMultiButton className="!bg-gradient-mountain hover:!opacity-90 !rounded-lg !px-6 !py-3 !text-sm !font-semibold !transition-all !duration-200 !w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}