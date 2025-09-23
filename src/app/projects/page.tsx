'use client';

import { useProjects } from '@/hooks/useEscrow';
import { Project } from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Users, Target, Shield, TrendingUp, ExternalLink } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';

function ProjectCard({ project }: { project: Project }) {
  const { connected } = useWallet();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Project Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-landscape rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-mountain-900">{project.name}</h3>
              <p className="text-sm text-mountain-600">{project.tokenSymbol}</p>
            </div>
          </div>
          {project.isVerified && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Verified
            </div>
          )}
        </div>

        <p className="text-mountain-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        {/* Project Links */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-cream-100 text-mountain-600 rounded-full text-xs hover:bg-cream-200 transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Website
            </a>
          )}
          {project.twitter && (
            <a
              href={project.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-xs hover:bg-sky-200 transition-colors"
            >
              Twitter
            </a>
          )}
          {project.discord && (
            <a
              href={project.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs hover:bg-purple-200 transition-colors"
            >
              Discord
            </a>
          )}
          {project.telegram && (
            <a
              href={project.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs hover:bg-blue-200 transition-colors"
            >
              Telegram
            </a>
          )}
        </div>

        {/* Token Information */}
        <div className="bg-cream-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-mountain-500">Token</div>
              <div className="font-medium">{project.tokenName}</div>
            </div>
            <div>
              <div className="text-mountain-500">Symbol</div>
              <div className="font-medium">{project.tokenSymbol}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {connected ? (
          <Link
            href={`/sale/${project.id}`}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center block"
          >
            View Token Sales
          </Link>
        ) : (
          <div className="text-center">
            <p className="text-mountain-600 mb-3 text-sm">Connect wallet to participate</p>
            <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Active Projects
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover and invest in innovative blockchain projects with tiered token sales and vesting schedules.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects && projects.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Active Projects</h3>
              <p className="text-white/70">Check back soon for new token sale opportunities!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}