'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMultiPresaleProjects, useSaleRounds, useUserPurchases } from '@/hooks/useMultiPresale';
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
  ChevronDown,
  Heart,
  Star,
  Eye,
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  Bookmark,
  Grid,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Crown,
  Award
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-hot-toast';

interface ExtendedProject extends MultiPresaleProject {
  saleRounds?: any[];
  activeRound?: any;
  trending?: boolean;
  featured?: boolean;
  popularity?: number;
  riskScore?: number;
  estimatedROI?: number;
  isWishlisted?: boolean;
  viewCount?: number;
  participantCount?: number;
}

interface MarketplaceFilters {
  category: string;
  status: string;
  saleType: string;
  search: string;
  priceRange: [number, number];
  riskLevel: string;
  timeToEnd: string;
  fundingProgress: string;
  featured: boolean;
  trending: boolean;
}

interface ViewPreferences {
  layout: 'grid' | 'list';
  itemsPerPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

function ProjectDiscoveryAlgorithm(projects: ExtendedProject[], userWallet?: string) {
  return useMemo(() => {
    if (!projects.length) return [];

    // Calculate project scores based on multiple factors
    const scoredProjects = projects.map(project => {
      let score = 0;
      
      // Funding progress factor (30% weight)
      const fundingProgress = project.targetAmount.toNumber() > 0 
        ? project.totalRaised.toNumber() / project.targetAmount.toNumber() 
        : 0;
      score += (fundingProgress * 0.3) * 100;
      
      // Time sensitivity factor (25% weight)
      if (project.activeRound) {
        const daysLeft = differenceInDays(
          new Date(project.activeRound.endTime.toNumber() * 1000),
          new Date()
        );
        const timeScore = Math.max(0, Math.min(1, (30 - daysLeft) / 30)); // Higher score for ending sooner
        score += timeScore * 25;
      }
      
      // Popularity factor (20% weight)
      score += (project.popularity || 0) * 0.2;
      
      // Risk vs Reward factor (15% weight)
      const riskRewardScore = Math.max(0, (project.estimatedROI || 0) - (project.riskScore || 50));
      score += (riskRewardScore / 100) * 15;
      
      // Activity factor (10% weight) - based on round activity
      const activityScore = project.saleRounds?.length || 0;
      score += Math.min(activityScore * 2, 10);
      
      return { ...project, discoveryScore: score };
    });

    // Sort by discovery score
    return scoredProjects.sort((a, b) => b.discoveryScore - a.discoveryScore);
  }, [projects, userWallet]);
}

function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem('marketplace-wishlist');
    if (saved) {
      setWishlist(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleWishlist = (projectId: number) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(projectId)) {
        newWishlist.delete(projectId);
        toast.success('Removed from wishlist');
      } else {
        newWishlist.add(projectId);
        toast.success('Added to wishlist');
      }
      localStorage.setItem('marketplace-wishlist', JSON.stringify(Array.from(newWishlist)));
      return newWishlist;
    });
  };

  return { wishlist, toggleWishlist };
}

function ProjectCard({ 
  project, 
  layout = 'grid',
  isWishlisted = false,
  onToggleWishlist 
}: { 
  project: ExtendedProject;
  layout?: 'grid' | 'list';
  isWishlisted?: boolean;
  onToggleWishlist?: (id: number) => void;
}) {
  const { connected } = useWallet();
  
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

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-600';
    if (risk < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const progressPercentage = project.targetAmount.toNumber() > 0 
    ? (project.totalRaised.toNumber() / project.targetAmount.toNumber()) * 100 
    : 0;

  const daysLeft = project.activeRound 
    ? differenceInDays(new Date(project.activeRound.endTime.toNumber() * 1000), new Date())
    : null;

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-landscape rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              {project.featured && (
                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-bold text-mountain-900">{project.name}</h3>
                {project.trending && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-mountain-600 text-sm mb-2 line-clamp-2">{project.description}</p>
              <div className="flex items-center space-x-4 text-sm text-mountain-500">
                <span>Category: {project.category}</span>
                <span>•</span>
                <span>Participants: {project.participantCount || 0}</span>
                {project.riskScore && (
                  <>
                    <span>•</span>
                    <span className={getRiskColor(project.riskScore)}>
                      Risk: {project.riskScore}/100
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-mountain-900">
                {(project.totalRaised.toNumber() / 1e6).toFixed(2)}M
              </div>
              <div className="text-xs text-mountain-500">Raised</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-mountain-900">
                {progressPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-mountain-500">Progress</div>
            </div>
            
            {daysLeft !== null && (
              <div className="text-center">
                <div className="text-lg font-bold text-mountain-900">
                  {daysLeft}d
                </div>
                <div className="text-xs text-mountain-500">Left</div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleWishlist?.(project.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-mountain-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              <Link
                href={`/projects/${project.id}`}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative">
      {/* Featured/Trending badges */}
      <div className="absolute top-3 left-3 z-10 flex space-x-2">
        {project.featured && (
          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Crown className="w-3 h-3 mr-1" />
            Featured
          </span>
        )}
        {project.trending && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={() => onToggleWishlist?.(project.id)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-lg transition-colors ${
          isWishlisted 
            ? 'text-red-500 bg-white/90 backdrop-blur-sm' 
            : 'text-mountain-400 bg-white/90 backdrop-blur-sm hover:text-red-500'
        }`}
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

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
            {project.activeRound && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSaleTypeColor(project.activeRound.saleType)}`}>
                {project.activeRound.saleType} Round
              </span>
            )}
          </div>
        </div>

        <p className="text-mountain-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-cream-50 rounded-lg p-3">
            <div className="flex items-center text-mountain-500 text-xs mb-1">
              <Target className="w-3 h-3 mr-1" />
              Progress
            </div>
            <div className="font-semibold text-mountain-900">
              {progressPercentage.toFixed(1)}%
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
              Participants
            </div>
            <div className="font-semibold text-mountain-900">
              {project.participantCount || 0}
            </div>
            {project.riskScore && (
              <div className={`text-xs ${getRiskColor(project.riskScore)}`}>
                Risk: {project.riskScore}/100
              </div>
            )}
          </div>
        </div>

        {/* Time & Price Info */}
        {project.activeRound && (
          <div className="bg-sky-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-sky-800">
                  {(project.activeRound.tokenPrice.toNumber() / 1e9).toFixed(4)} SOL/token
                </div>
                <div className="text-xs text-sky-600">
                  {project.activeRound.tokensSold.toNumber().toLocaleString()} / {project.activeRound.totalTokens.toNumber().toLocaleString()} sold
                </div>
              </div>
              {daysLeft !== null && (
                <div className="text-right">
                  <div className="flex items-center text-xs text-sky-600">
                    <Clock className="w-3 h-3 mr-1" />
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Ending soon'}
                  </div>
                  {project.estimatedROI && (
                    <div className="text-xs text-green-600">
                      Est. ROI: {project.estimatedROI}%
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project Links */}
        <div className="flex space-x-2 mb-4">
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 bg-cream-100 text-mountain-600 rounded-full text-xs hover:bg-cream-200 transition-colors"
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
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs hover:bg-blue-200 transition-colors"
            >
              Twitter
            </a>
          )}
        </div>

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
            <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-colors !w-full" />
          </div>
        )}
      </div>
    </div>
  );
}

function AdvancedFilterSidebar({ 
  filters, 
  setFilters,
  onReset 
}: { 
  filters: MarketplaceFilters; 
  setFilters: (filters: MarketplaceFilters) => void;
  onReset: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState({
    basic: true,
    advanced: false,
    special: false,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-mountain-900">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-sky-600 hover:text-sky-700 font-medium"
        >
          Reset All
        </button>
      </div>
      
      {/* Basic Filters */}
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(prev => ({ ...prev, basic: !prev.basic }))}
          className="flex items-center justify-between w-full text-sm font-medium text-mountain-700 mb-3"
        >
          Basic Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded.basic ? 'rotate-180' : ''}`} />
        </button>
        
        {isExpanded.basic && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
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
            <div>
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
            <div>
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
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(prev => ({ ...prev, advanced: !prev.advanced }))}
          className="flex items-center justify-between w-full text-sm font-medium text-mountain-700 mb-3"
        >
          Advanced Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded.advanced ? 'rotate-180' : ''}`} />
        </button>
        
        {isExpanded.advanced && (
          <div className="space-y-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Token Price Range (SOL)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Min"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: [parseFloat(e.target.value) || 0, filters.priceRange[1]] 
                  })}
                  className="p-2 border border-mountain-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Max"
                  value={filters.priceRange[1] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: [filters.priceRange[0], parseFloat(e.target.value) || 0] 
                  })}
                  className="p-2 border border-mountain-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">Risk Level</label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                className="w-full p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              >
                <option value="">Any Risk</option>
                <option value="low">Low Risk (0-30)</option>
                <option value="medium">Medium Risk (31-70)</option>
                <option value="high">High Risk (71-100)</option>
              </select>
            </div>

            {/* Time to End */}
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">Time to End</label>
              <select
                value={filters.timeToEnd}
                onChange={(e) => setFilters({ ...filters, timeToEnd: e.target.value })}
                className="w-full p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              >
                <option value="">Any Time</option>
                <option value="24h">Next 24 hours</option>
                <option value="7d">Next 7 days</option>
                <option value="30d">Next 30 days</option>
              </select>
            </div>

            {/* Funding Progress */}
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">Funding Progress</label>
              <select
                value={filters.fundingProgress}
                onChange={(e) => setFilters({ ...filters, fundingProgress: e.target.value })}
                className="w-full p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              >
                <option value="">Any Progress</option>
                <option value="early">Early Stage (0-25%)</option>
                <option value="growing">Growing (26-75%)</option>
                <option value="closing">Almost Funded (76-100%)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Special Filters */}
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(prev => ({ ...prev, special: !prev.special }))}
          className="flex items-center justify-between w-full text-sm font-medium text-mountain-700 mb-3"
        >
          Special Categories
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded.special ? 'rotate-180' : ''}`} />
        </button>
        
        {isExpanded.special && (
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm">Featured Projects</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.trending}
                onChange={(e) => setFilters({ ...filters, trending: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm">Trending Projects</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnhancedMarketplacePage() {
  const { data: projects, isLoading, refetch } = useMultiPresaleProjects();
  const { publicKey } = useWallet();
  const { wishlist, toggleWishlist } = useWishlist();

  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: '',
    status: '',
    saleType: '',
    search: '',
    priceRange: [0, 0],
    riskLevel: '',
    timeToEnd: '',
    fundingProgress: '',
    featured: false,
    trending: false,
  });

  const [viewPrefs, setViewPrefs] = useState<ViewPreferences>({
    layout: 'grid',
    itemsPerPage: 12,
    sortBy: 'discovery',
    sortOrder: 'desc',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Enhanced projects with additional data
  const enhancedProjects = useMemo(() => {
    if (!projects) return [];
    
    return projects.map(project => ({
      ...project,
      trending: Math.random() > 0.7, // Mock trending data
      featured: Math.random() > 0.8, // Mock featured data
      popularity: Math.floor(Math.random() * 100),
      riskScore: Math.floor(Math.random() * 100),
      estimatedROI: Math.floor(Math.random() * 500) + 50,
      viewCount: Math.floor(Math.random() * 10000),
      participantCount: Math.floor(Math.random() * 1000),
      isWishlisted: wishlist.has(project.id),
    })) as ExtendedProject[];
  }, [projects, wishlist]);

  // Project discovery algorithm
  const discoveredProjects = ProjectDiscoveryAlgorithm(enhancedProjects, publicKey?.toString());

  // Apply filters
  const filteredProjects = useMemo(() => {
    return discoveredProjects.filter(project => {
      // Basic filters
      if (filters.category && project.category !== filters.category) return false;
      if (filters.status && project.status !== filters.status) return false;
      if (filters.saleType && project.activeRound?.saleType !== filters.saleType) return false;
      if (filters.search && 
          !project.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !project.description.toLowerCase().includes(filters.search.toLowerCase())) return false;

      // Advanced filters
      if (filters.priceRange[0] > 0 && project.activeRound && 
          project.activeRound.tokenPrice.toNumber() / 1e9 < filters.priceRange[0]) return false;
      if (filters.priceRange[1] > 0 && project.activeRound && 
          project.activeRound.tokenPrice.toNumber() / 1e9 > filters.priceRange[1]) return false;

      if (filters.riskLevel) {
        const risk = project.riskScore || 50;
        if (filters.riskLevel === 'low' && risk > 30) return false;
        if (filters.riskLevel === 'medium' && (risk <= 30 || risk > 70)) return false;
        if (filters.riskLevel === 'high' && risk <= 70) return false;
      }

      if (filters.timeToEnd && project.activeRound) {
        const daysLeft = differenceInDays(
          new Date(project.activeRound.endTime.toNumber() * 1000),
          new Date()
        );
        if (filters.timeToEnd === '24h' && daysLeft > 1) return false;
        if (filters.timeToEnd === '7d' && daysLeft > 7) return false;
        if (filters.timeToEnd === '30d' && daysLeft > 30) return false;
      }

      if (filters.fundingProgress) {
        const progress = project.targetAmount.toNumber() > 0 
          ? (project.totalRaised.toNumber() / project.targetAmount.toNumber()) * 100 
          : 0;
        if (filters.fundingProgress === 'early' && progress > 25) return false;
        if (filters.fundingProgress === 'growing' && (progress <= 25 || progress > 75)) return false;
        if (filters.fundingProgress === 'closing' && progress <= 75) return false;
      }

      // Special filters
      if (filters.featured && !project.featured) return false;
      if (filters.trending && !project.trending) return false;

      return true;
    });
  }, [discoveredProjects, filters]);

  // Apply sorting
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects].sort((a, b) => {
      let comparison = 0;
      
      switch (viewPrefs.sortBy) {
        case 'discovery':
          comparison = (b.discoveryScore || 0) - (a.discoveryScore || 0);
          break;
        case 'newest':
          comparison = b.createdAt.toNumber() - a.createdAt.toNumber();
          break;
        case 'ending-soon':
          if (a.activeRound && b.activeRound) {
            comparison = a.activeRound.endTime.toNumber() - b.activeRound.endTime.toNumber();
          }
          break;
        case 'most-raised':
          comparison = b.totalRaised.toNumber() - a.totalRaised.toNumber();
          break;
        case 'progress':
          const progressA = a.targetAmount.toNumber() > 0 ? a.totalRaised.toNumber() / a.targetAmount.toNumber() : 0;
          const progressB = b.targetAmount.toNumber() > 0 ? b.totalRaised.toNumber() / b.targetAmount.toNumber() : 0;
          comparison = progressB - progressA;
          break;
        case 'popularity':
          comparison = (b.popularity || 0) - (a.popularity || 0);
          break;
        case 'risk':
          comparison = (a.riskScore || 50) - (b.riskScore || 50);
          break;
        default:
          comparison = 0;
      }
      
      return viewPrefs.sortOrder === 'asc' ? -comparison : comparison;
    });
    
    return sorted;
  }, [filteredProjects, viewPrefs.sortBy, viewPrefs.sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / viewPrefs.itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * viewPrefs.itemsPerPage,
    currentPage * viewPrefs.itemsPerPage
  );

  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      saleType: '',
      search: '',
      priceRange: [0, 0],
      riskLevel: '',
      timeToEnd: '',
      fundingProgress: '',
      featured: false,
      trending: false,
    });
    setCurrentPage(1);
  };

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
              Enhanced Token Sale Marketplace
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover and invest in innovative blockchain projects with AI-powered project discovery and advanced filtering.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{projects?.length || 0}</div>
                <div className="text-white/80 text-sm">Active Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{enhancedProjects.filter(p => p.trending).length}</div>
                <div className="text-white/80 text-sm">Trending</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{wishlist.size}</div>
                <div className="text-white/80 text-sm">Wishlisted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {enhancedProjects.reduce((sum, p) => sum + (p.participantCount || 0), 0)}
                </div>
                <div className="text-white/80 text-sm">Total Participants</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls Bar */}
      <div className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mountain-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects, descriptions, categories..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                />
              </div>
              
              {/* View Controls */}
              <div className="flex items-center gap-4">
                {/* Layout Toggle */}
                <div className="flex bg-mountain-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewPrefs(prev => ({ ...prev, layout: 'grid' }))}
                    className={`p-2 rounded ${viewPrefs.layout === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewPrefs(prev => ({ ...prev, layout: 'list' }))}
                    className={`p-2 rounded ${viewPrefs.layout === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Sort */}
                <select
                  value={viewPrefs.sortBy}
                  onChange={(e) => setViewPrefs(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                >
                  <option value="discovery">Smart Discovery</option>
                  <option value="newest">Newest First</option>
                  <option value="ending-soon">Ending Soon</option>
                  <option value="most-raised">Most Raised</option>
                  <option value="progress">Progress</option>
                  <option value="popularity">Popularity</option>
                  <option value="risk">Risk Level</option>
                </select>

                {/* Sort Order */}
                <button
                  onClick={() => setViewPrefs(prev => ({ 
                    ...prev, 
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                  }))}
                  className="p-2 border border-mountain-300 rounded-lg bg-white hover:bg-mountain-50"
                >
                  {viewPrefs.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
                
                {/* Refresh */}
                <button
                  onClick={() => refetch()}
                  className="p-2 border border-mountain-300 rounded-lg bg-white hover:bg-mountain-50"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Advanced Filters Sidebar */}
            <div className="lg:col-span-1">
              <AdvancedFilterSidebar 
                filters={filters} 
                setFilters={setFilters}
                onReset={resetFilters}
              />
            </div>

            {/* Projects Grid */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-white">
                  <span className="text-lg font-semibold">
                    {sortedProjects.length} projects found
                  </span>
                  {filteredProjects.length !== enhancedProjects.length && (
                    <span className="text-white/70 ml-2">
                      (filtered from {enhancedProjects.length})
                    </span>
                  )}
                </div>
                
                <select
                  value={viewPrefs.itemsPerPage}
                  onChange={(e) => setViewPrefs(prev => ({ ...prev, itemsPerPage: parseInt(e.target.value) }))}
                  className="p-2 border border-mountain-300 rounded-lg bg-white text-sm"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>

              {/* Projects Display */}
              {paginatedProjects.length > 0 ? (
                <>
                  <div className={`grid gap-6 ${
                    viewPrefs.layout === 'grid' 
                      ? 'md:grid-cols-2 xl:grid-cols-2' 
                      : 'grid-cols-1'
                  }`}>
                    {paginatedProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project}
                        layout={viewPrefs.layout}
                        isWishlisted={wishlist.has(project.id)}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-white border border-mountain-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mountain-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === i + 1
                              ? 'bg-sky-600 text-white'
                              : 'bg-white border border-mountain-300 hover:bg-mountain-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-white border border-mountain-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mountain-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {Object.values(filters).some(f => f) 
                      ? 'No Projects Match Your Filters'
                      : 'No Active Projects'
                    }
                  </h3>
                  <p className="text-white/70 mb-6">
                    {Object.values(filters).some(f => f)
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Check back soon for new token sale opportunities!'
                    }
                  </p>
                  {Object.values(filters).some(f => f) && (
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}