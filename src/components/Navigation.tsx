'use client';

import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Shield, Plus, TrendingUp, User, Settings, Sparkles, BarChart3, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const { connected } = useWallet();
  const { isAdmin } = useAdminAccess();
  const [showMarketplaceDropdown, setShowMarketplaceDropdown] = useState(false);
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-cream-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-landscape rounded-lg flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-mountain-900">TokenSale Platform</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Marketplace Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowMarketplaceDropdown(true)}
                onMouseLeave={() => setShowMarketplaceDropdown(false)}
                className="text-mountain-600 hover:text-sky-600 transition-colors font-medium inline-flex items-center"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Marketplace
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              
              {showMarketplaceDropdown && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-cream-200 py-2 z-50"
                  onMouseEnter={() => setShowMarketplaceDropdown(true)}
                  onMouseLeave={() => setShowMarketplaceDropdown(false)}
                >
                  <Link
                    href="/marketplace"
                    className="flex items-center px-4 py-2 text-mountain-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 mr-3" />
                    <div>
                      <div className="font-medium">Basic Marketplace</div>
                      <div className="text-xs text-mountain-500">Browse all projects</div>
                    </div>
                  </Link>
                  <Link
                    href="/marketplace/enhanced"
                    className="flex items-center px-4 py-2 text-mountain-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-3" />
                    <div>
                      <div className="font-medium">Enhanced Marketplace</div>
                      <div className="text-xs text-mountain-500">AI-powered discovery</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            {connected && (
              <>
                <Link 
                  href="/create-project"
                  className="text-mountain-600 hover:text-sky-600 transition-colors font-medium inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Launch Project
                </Link>
                
                <Link 
                  href="/dashboard/creator"
                  className="text-mountain-600 hover:text-sky-600 transition-colors font-medium inline-flex items-center"
                >
                  <User className="w-4 h-4 mr-1" />
                  Creator Dashboard
                </Link>
                
                {/* Portfolio Dropdown */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowPortfolioDropdown(true)}
                    onMouseLeave={() => setShowPortfolioDropdown(false)}
                    className="text-mountain-600 hover:text-sky-600 transition-colors font-medium inline-flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Portfolio
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                  
                  {showPortfolioDropdown && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-cream-200 py-2 z-50"
                      onMouseEnter={() => setShowPortfolioDropdown(true)}
                      onMouseLeave={() => setShowPortfolioDropdown(false)}
                    >
                      <Link
                        href="/portfolio"
                        className="flex items-center px-4 py-2 text-mountain-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        <div>
                          <div className="font-medium">Basic Portfolio</div>
                          <div className="text-xs text-mountain-500">Holdings & vesting</div>
                        </div>
                      </Link>
                      <Link
                        href="/investor-dashboard"
                        className="flex items-center px-4 py-2 text-mountain-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 mr-3" />
                        <div>
                          <div className="font-medium">Investor Dashboard</div>
                          <div className="text-xs text-mountain-500">Advanced analytics</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {isAdmin && (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowAdminDropdown(true)}
                  onMouseLeave={() => setShowAdminDropdown(false)}
                  className="text-coral-600 hover:text-coral-700 transition-colors font-medium inline-flex items-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Admin
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                
                {showAdminDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-cream-200 py-2 z-50"
                    onMouseEnter={() => setShowAdminDropdown(true)}
                    onMouseLeave={() => setShowAdminDropdown(false)}
                  >
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-coral-600 hover:text-coral-700 hover:bg-coral-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      <div>
                        <div className="font-medium">Basic Admin</div>
                        <div className="text-xs text-mountain-500">Contract management</div>
                      </div>
                    </Link>
                    <Link
                      href="/admin/enhanced"
                      className="flex items-center px-4 py-2 text-coral-600 hover:text-coral-700 hover:bg-coral-50 transition-colors"
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      <div>
                        <div className="font-medium">Enhanced Dashboard</div>
                        <div className="text-xs text-mountain-500">Full platform management</div>
                      </div>
                    </Link>
                    <Link
                      href="/system-test"
                      className="flex items-center px-4 py-2 text-coral-600 hover:text-coral-700 hover:bg-coral-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      <div>
                        <div className="font-medium">System Test</div>
                        <div className="text-xs text-mountain-500">Integration testing</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-colors" />
          </div>
        </div>

        {/* Mobile Navigation */}
        {connected && (
          <div className="md:hidden border-t border-cream-200 py-3">
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/marketplace"
                className="text-mountain-600 hover:text-sky-600 transition-colors font-medium text-sm inline-flex items-center"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Marketplace
              </Link>
              
              <Link 
                href="/marketplace/enhanced"
                className="text-mountain-600 hover:text-sky-600 transition-colors font-medium text-sm inline-flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Enhanced
              </Link>
              
              <Link 
                href="/create-project"
                className="text-mountain-600 hover:text-sky-600 transition-colors font-medium text-sm inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Launch
              </Link>
              
              <Link 
                href="/dashboard/creator"
                className="text-mountain-600 hover:text-sky-600 transition-colors font-medium text-sm inline-flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Creator
              </Link>
              
              <Link 
                href="/portfolio"
                className="text-mountain-600 hover:text-sky-600 transition-colors font-medium text-sm inline-flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Portfolio
              </Link>
              
              <Link 
                href="/investor-dashboard"
                className="text-mountain-600 hover:text-sky-600 transition-colors font-medium text-sm inline-flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Link>

              {isAdmin && (
                <>
                  <Link 
                    href="/admin"
                    className="text-coral-600 hover:text-coral-700 transition-colors font-medium text-sm inline-flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                  <Link 
                    href="/admin/enhanced"
                    className="text-coral-600 hover:text-coral-700 transition-colors font-medium text-sm inline-flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Enhanced
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}