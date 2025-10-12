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
    <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group" aria-label="Home">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Shield className="text-black w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">
                Snarbles
              </span>
              <span className="text-[10px] text-white/50 -mt-0.5 font-medium tracking-wide uppercase">Token Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              if (link.protected && !connected) return null;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    ${isActive(link.href)
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                    }
                    transition-colors duration-150 font-medium inline-flex items-center px-3 py-2 rounded-lg text-sm
                  `}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {connected && (
              <Link
                href="/create-project"
                className="bg-white text-black hover:bg-white/90 px-4 py-2 ml-2 rounded-lg font-medium transition-all duration-150 inline-flex items-center text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Launch Sale</span>
              </Link>
            )}
            
            {/* Wallet Connection */}
            <div className="ml-2">
              <WalletMultiButton className="!bg-white/10 !border-0 !text-white hover:!bg-white/20 !rounded-lg !font-medium !transition-all !duration-150 !px-4 !py-2 !text-sm" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
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
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
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
                        ? 'text-white'
                        : 'text-white/60 hover:text-white'
                      }
                      px-4 py-3 rounded-lg font-medium inline-flex items-center transition-colors hover:bg-white/5
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
                  className="bg-white text-black px-4 py-3 rounded-lg font-medium inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Launch Sale
                </Link>
              )}
              
              <div className="pt-2">
                <WalletMultiButton className="!w-full !bg-white/10 !border-0 !text-white !rounded-lg !font-medium !px-4 !py-3" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}