'use client';

import { Navigation } from '@/components/Navigation';
import { useProjects } from '@/hooks/useEscrow';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Zap, Users, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: projects, isLoading } = useProjects();
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-landscape rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="text-white w-10 h-10" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-mountain-900 mb-6">
            Launch Your Token Sale
            <span className="block text-sky-600">Without Trust Issues</span>
          </h1>
          
          <p className="text-xl text-mountain-600 max-w-3xl mx-auto mb-8">
            The secure, multi-project platform for token presales with vesting. 
            Create tiered sales, build community, and launch successfully with built-in escrow protection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {connected ? (
              <Link 
                href="/create-project"
                className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Launch Your Project
              </Link>
            ) : (
              <WalletMultiButton className="!bg-sky-600 !py-4 !px-8 !rounded-lg !font-semibold hover:!bg-sky-700 !transition-all !duration-200 !shadow-lg hover:!shadow-xl" />
            )}
            
            <Link 
              href="/projects"
              className="border-2 border-sky-600 text-sky-600 px-8 py-4 rounded-lg font-semibold hover:bg-sky-600 hover:text-white transition-all duration-200 inline-flex items-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-mountain-900 mb-12">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-sky-100">
              <Shield className="w-12 h-12 text-sky-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-mountain-900 mb-3">Secure Escrow</h3>
              <p className="text-mountain-600">
                Smart contract escrow ensures funds and tokens are safe. No trust required between buyers and sellers.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-golden-100">
              <Zap className="w-12 h-12 text-golden-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-mountain-900 mb-3">Tiered Sales</h3>
              <p className="text-mountain-600">
                Create Seed, Private, and Public sales with different pricing and vesting schedules for maximum success.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-forest-100">
              <Users className="w-12 h-12 text-forest-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-mountain-900 mb-3">Community Tools</h3>
              <p className="text-mountain-600">
                Built-in referral system, whitelist management, and social sharing to grow your community organically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-mountain-900">Featured Projects</h2>
            <Link 
              href="/projects"
              className="text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center"
            >
              View All <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-cream-200 animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-cream-200 hover:border-sky-300 transition-all duration-200">
                  <div className="w-12 h-12 bg-gradient-landscape rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{project.name.charAt(0)}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-mountain-900 mb-2">{project.name}</h3>
                  <p className="text-mountain-600 mb-4 line-clamp-2">{project.description}</p>
                  
                  <Link 
                    href={`/project/${project.slug}`}
                    className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors inline-block text-center"
                  >
                    View Project
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-mountain-900 mb-2">No Projects Yet</h3>
              <p className="text-mountain-600 mb-6">Be the first to launch a token sale on our platform!</p>
              {connected && (
                <Link 
                  href="/create-project"
                  className="bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
                >
                  Create First Project
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-mountain-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-sky-400 mb-2">{projects?.length || 0}</div>
              <div className="text-mountain-300">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-golden-400 mb-2">0</div>
              <div className="text-mountain-300">Total Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-forest-400 mb-2">0</div>
              <div className="text-mountain-300">Token Holders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-coral-400 mb-2">100%</div>
              <div className="text-mountain-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}