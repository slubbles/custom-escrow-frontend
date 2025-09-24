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
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-golden-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Shield className="text-white w-12 h-12" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-mountain-900 mb-6 leading-tight">
            Launch Your Token Sale
            <span className="block bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
              Secure & Simple
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-mountain-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Create your token presale with built-in escrow protection. 
            <br className="hidden md:block" />
            Set your price, launch your sale, and let investors buy tokens safely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {connected ? (
              <Link 
                href="/create-project"
                className="group bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-10 py-5 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center text-lg"
              >
                <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                Launch Token Sale
              </Link>
            ) : (
              <WalletMultiButton className="!bg-gradient-to-r !from-sky-600 !to-sky-700 hover:!from-sky-700 hover:!to-sky-800 !py-5 !px-10 !rounded-2xl !font-semibold !transition-all !duration-300 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105 !text-lg" />
            )}
            
            <Link 
              href="/projects"
              className="group border-2 border-sky-200 bg-white/80 backdrop-blur-sm text-sky-700 px-10 py-5 rounded-2xl font-semibold hover:bg-sky-50 hover:border-sky-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center text-lg"
            >
              <TrendingUp className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Browse Token Sales
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-sky-100 shadow-lg">
              <div className="text-3xl font-bold text-sky-600 mb-2">100%</div>
              <div className="text-mountain-600">Secure Escrow</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-golden-100 shadow-lg">
              <div className="text-3xl font-bold text-golden-600 mb-2">5min</div>
              <div className="text-mountain-600">Setup Time</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-forest-100 shadow-lg">
              <div className="text-3xl font-bold text-forest-600 mb-2">24/7</div>
              <div className="text-mountain-600">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/50 to-sky-50/50 backdrop-blur-sm relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-mountain-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-mountain-600 max-w-2xl mx-auto">
              Three simple steps to launch your token sale and start raising funds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-sky-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="w-8 h-1 bg-sky-600 rounded mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">1. Create Sale</h3>
              <p className="text-mountain-600 leading-relaxed">
                Set your token details, pricing, and sale parameters. Launch your presale in just minutes with our intuitive wizard.
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-golden-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-golden-500 to-golden-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="w-8 h-1 bg-golden-600 rounded mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">2. Investors Buy</h3>
              <p className="text-mountain-600 leading-relaxed">
                Investors discover and purchase tokens from your sale. All funds are automatically held in secure escrow protection.
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-forest-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="w-8 h-1 bg-forest-600 rounded mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">3. Safe Distribution</h3>
              <p className="text-mountain-600 leading-relaxed">
                When your sale ends, tokens are automatically distributed to buyers and you receive the funds. Simple and secure.
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