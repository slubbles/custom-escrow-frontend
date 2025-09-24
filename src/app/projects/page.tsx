'use client';

import { useProjects } from '@/hooks/useEscrow';
import { Project } from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, TrendingUp, ExternalLink, Plus } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';

function SimpleProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-cream-200/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-sky-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-forest-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-mountain-900 group-hover:text-sky-600 transition-colors">{project.name}</h3>
            <p className="text-sm text-mountain-500 font-medium">${project.tokenSymbol}</p>
          </div>
        </div>
        {project.isVerified && (
          <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-mountain-600 text-sm mb-6 line-clamp-3 leading-relaxed">{project.description}</p>

      {/* Progress Bar Placeholder */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-mountain-500">Progress</span>
          <span className="text-xs text-mountain-500">75%</span>
        </div>
        <div className="w-full bg-cream-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full w-3/4 shadow-sm"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mountain-400 hover:text-sky-600 transition-colors p-1 rounded-lg hover:bg-sky-50"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <div className="text-xs text-mountain-500">
            <span className="font-medium">$0.50</span> per token
          </div>
        </div>
        <Link
          href={`/projects/${project.id}`}
          className="group/btn bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center"
        >
          View Sale
          <TrendingUp className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { data: projects, isLoading, error, refetch } = useProjects();
  const { connected } = useWallet();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
        <Navigation />
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-golden-400 mx-auto animate-spin" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
            </div>
            <h3 className="text-xl font-semibold text-mountain-900 mb-2">Loading Token Sales</h3>
            <p className="text-mountain-600">Discovering the latest opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
        <Navigation />
        <div className="flex justify-center items-center py-32">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="bg-gradient-to-br from-coral-100 to-coral-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-coral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-mountain-900 mb-4">Unable to Load Token Sales</h2>
            <p className="text-mountain-600 mb-2">We're having trouble connecting to the blockchain.</p>
            <p className="text-mountain-500 text-sm mb-8">{error.message}</p>
            <button 
              onClick={() => refetch()}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-golden-200/40 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-sky-100/80 backdrop-blur-sm text-sky-700 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-sky-500 rounded-full mr-2 animate-pulse"></div>
            Live Token Sales
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-mountain-900 mb-6">
            Active Token Sales
          </h1>
          <p className="text-xl text-mountain-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover promising projects launching their tokens. Research, invest, and be part of the next big thing in crypto.
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm text-mountain-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-forest-500 rounded-full mr-2"></div>
              <span>3 Active Sales</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-golden-500 rounded-full mr-2"></div>
              <span>$2.4M Raised</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div>
              <span>1,247 Investors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {!projects || projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-mountain-200 to-mountain-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Shield className="w-12 h-12 text-mountain-500" />
              </div>
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">No Token Sales Yet</h3>
              <p className="text-lg text-mountain-600 mb-8 max-w-md mx-auto">
                Be the first to launch your token sale and start raising funds from investors worldwide.
              </p>
              {connected ? (
                <Link
                  href="/create-project"
                  className="group bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center text-lg"
                >
                  <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Launch Token Sale
                </Link>
              ) : (
                <WalletMultiButton className="!bg-gradient-to-r !from-sky-600 !to-sky-700 hover:!from-sky-700 hover:!to-sky-800 !px-8 !py-4 !rounded-2xl !font-semibold !text-lg !shadow-xl hover:!shadow-2xl !transform hover:!scale-105" />
              )}
            </div>
          ) : (
            <>
              {/* Filter Bar */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-mountain-600 font-medium">
                    {projects.length} active sale{projects.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-cream-200 text-mountain-600 rounded-xl text-sm font-medium hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 transition-all">
                    Latest
                  </button>
                  <button className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-cream-200 text-mountain-600 rounded-xl text-sm font-medium hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 transition-all">
                    Popular
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <SimpleProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}