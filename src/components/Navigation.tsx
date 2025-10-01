'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Plus, TrendingUp, LayoutDashboard, Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const { connected } = useWallet();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/projects', label: 'Browse Sales', icon: TrendingUp },
    { href: '/portfolio', label: 'Portfolio', icon: Briefcase, protected: true },
    { href: '/dashboard/creator', label: 'Dashboard', icon: LayoutDashboard, protected: true },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-cream-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group" aria-label="Home">
            <div className="w-12 h-12 bg-gradient-landscape rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:glow-sky">
              <Shield className="text-white w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-mountain-900 group-hover:text-sky-600 transition-colors">
                Snarbles
              </span>
              <span className="text-xs text-mountain-500 -mt-1">Token Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              if (link.protected && !connected) return null;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    ${isActive(link.href)
                      ? 'bg-sky-100 text-sky-700 border-sky-200'
                      : 'text-mountain-600 hover:text-sky-600 hover:bg-sky-50 border-transparent'
                    }
                    border-2 transition-all duration-200 font-medium inline-flex items-center px-4 py-2 rounded-xl group
                  `}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
            
            {connected && (
              <Link
                href="/create-project"
                className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" aria-hidden="true" />
                Launch Sale
              </Link>
            )}
            
            {/* Wallet Connection */}
            <WalletMultiButton className="!bg-white !border-2 !border-sky-200 !text-sky-700 hover:!bg-sky-50 hover:!border-sky-300 !rounded-xl !font-medium !transition-all !duration-200 !shadow-sm hover:!shadow-md !px-4 !py-2.5" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-mountain-600 hover:text-sky-600 p-2 rounded-xl hover:bg-sky-50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cream-200 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                if (link.protected && !connected) return null;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      ${isActive(link.href)
                        ? 'bg-sky-100 text-sky-700'
                        : 'text-mountain-600 hover:text-sky-600 hover:bg-sky-50'
                      }
                      px-4 py-3 rounded-xl font-medium inline-flex items-center transition-colors
                    `}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
              
              {connected && (
                <Link
                  href="/create-project"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-3 rounded-xl font-medium inline-flex items-center shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Launch Sale
                </Link>
              )}
              
              <div className="pt-2">
                <WalletMultiButton className="!w-full !bg-white !border-2 !border-sky-200 !text-sky-700 !rounded-xl !font-medium !px-4 !py-3" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}