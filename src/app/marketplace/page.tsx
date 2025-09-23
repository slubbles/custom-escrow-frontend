'use client';

import { useState } from 'react';
import { useMultiPresaleProjects, useSaleRounds } from '@/hooks/useMultiPresale';
import { MultiPresaleProject, ProjectCategory, ProjectStatus, SaleType } from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Target, 
  Users,
  ExternalLink,
  Shield,
  ChevronDown
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';

interface ProjectCardProps {
  project: MultiPresaleProject;
  saleRounds?: any[];
}

function ProjectCard({ project, saleRounds = [] }: ProjectCardProps) {
  const { connected } = useWallet();
  
  // Get the current active round
  const activeRound = saleRounds.find(round => 
    round.isActive && 
    Date.now() / 1000 >= round.startTime.toNumber() && 
    Date.now() / 1000 <= round.endTime.toNumber()
  );

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case ProjectStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case ProjectStatus.PAUSED: return 'bg-gray-100 text-gray-800';
      case ProjectStatus.COMPLETED: return 'bg-blue-100 text-blue-800';
      case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSaleTypeColor = (saleType?: SaleType) => {
    switch (saleType) {
      case SaleType.SEED: return 'bg-purple-100 text-purple-800';
      case SaleType.PRIVATE: return 'bg-orange-100 text-orange-800';
      case SaleType.PUBLIC: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progressPercentage = project.targetAmount.toNumber() > 0 
    ? (project.totalRaised.toNumber() / project.targetAmount.toNumber()) * 100 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      {/* Project Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-landscape rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-mountain-900">{project.name}</h3>
              <p className="text-sm text-mountain-600">ID: #{project.id}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            {activeRound && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSaleTypeColor(activeRound.saleType)}`}>
                {activeRound.saleType} Round
              </span>
            )}
          </div>
        </div>

        <p className="text-mountain-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-cream-50 rounded-lg p-3">
            <div className="flex items-center text-mountain-500 text-xs mb-1">
              <Target className="w-3 h-3 mr-1" />
              Raised / Target
            </div>
            <div className="font-semibold text-mountain-900">
              {(project.totalRaised.toNumber() / 1e6).toFixed(2)}M / {(project.targetAmount.toNumber() / 1e6).toFixed(2)}M SOL
            </div>
            <div className="w-full bg-cream-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-mountain h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="bg-cream-50 rounded-lg p-3">
            <div className="flex items-center text-mountain-500 text-xs mb-1">
              <Users className="w-3 h-3 mr-1" />
              Round Info
            </div>
            <div className="font-semibold text-mountain-900">
              Round {project.currentRound.toString()} of {project.totalRounds.toString()}
            </div>
            {activeRound && (
              <div className="text-xs text-mountain-600">
                {(activeRound.tokenPrice.toNumber() / 1e9).toFixed(4)} SOL/token
              </div>
            )}
          </div>
        </div>

        {/* Active Round Info */}
        {activeRound && (
          <div className="bg-sky-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-sky-800">Current Round</div>
                <div className="text-xs text-sky-600">
                  {activeRound.tokensSold.toNumber().toLocaleString()} / {activeRound.totalTokens.toNumber().toLocaleString()} tokens sold
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-xs text-sky-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Ends {new Date(activeRound.endTime.toNumber() * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Links */}
        {project.website && (
          <div className="mb-4">
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-cream-100 text-mountain-600 rounded-full text-xs hover:bg-cream-200 transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Website
            </a>
          </div>
        )}

        {/* Action Button */}
        {connected ? (
          <Link
            href={`/projects/${project.id}`}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center block"
          >
            View Project Details
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

function FilterSidebar({ 
  filters, 
  setFilters 
}: { 
  filters: any; 
  setFilters: (filters: any) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-6">
      <h3 className="text-lg font-semibold text-mountain-900 mb-4">Filters</h3>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-mountain-700 mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
        >
          <option value="">All Categories</option>
          {Object.values(ProjectCategory).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-mountain-700 mb-2">Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
        >
          <option value="">All Statuses</option>
          {Object.values(ProjectStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Sale Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-mountain-700 mb-2">Sale Type</label>
        <select
          value={filters.saleType}
          onChange={(e) => setFilters({ ...filters, saleType: e.target.value })}
          className="w-full p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
        >
          <option value="">All Types</option>
          {Object.values(SaleType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => setFilters({ category: '', status: '', saleType: '', search: '' })}
        className="w-full bg-mountain-100 hover:bg-mountain-200 text-mountain-700 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default function MarketplacePage() {
  const { data: projects, isLoading } = useMultiPresaleProjects();
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    saleType: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort projects
  const filteredProjects = projects?.filter(project => {
    if (filters.category && project.category !== filters.category) return false;
    if (filters.status && project.status !== filters.status) return false;
    if (filters.search && !project.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !project.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }) || [];

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.toNumber() - a.createdAt.toNumber();
      case 'ending-soon':
        return a.currentRound - b.currentRound;
      case 'most-raised':
        return b.totalRaised.toNumber() - a.totalRaised.toNumber();
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading marketplace...</p>
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
              Token Sale Marketplace
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover and invest in innovative blockchain projects with multi-round token sales.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Sort Bar */}
      <div className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mountain-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                />
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-mountain-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                >
                  <option value="newest">Newest</option>
                  <option value="ending-soon">Ending Soon</option>
                  <option value="most-raised">Most Raised</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>

            {/* Projects Grid */}
            <div className="lg:col-span-3">
              {sortedProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                  {sortedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {filters.search || filters.category || filters.status 
                      ? 'No Projects Match Your Filters'
                      : 'No Active Projects'
                    }
                  </h3>
                  <p className="text-white/70">
                    {filters.search || filters.category || filters.status
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Check back soon for new token sale opportunities!'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}