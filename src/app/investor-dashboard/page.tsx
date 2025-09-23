'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  useMultiPresaleProjects, 
  useUserPurchases, 
  useSaleRounds 
} from '@/hooks/useMultiPresale';
import { Navigation } from '@/components/Navigation';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Calendar,
  Eye,
  ExternalLink,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Wallet,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Star,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface PortfolioPosition {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectStatus: string;
  tokensPurchased: number;
  totalInvested: number; // in SOL
  averagePrice: number; // SOL per token
  currentPrice?: number; // Current market price
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  vestingInfo: {
    totalTokens: number;
    vestedTokens: number;
    claimedTokens: number;
    nextVestingDate?: Date;
    vestingProgress: number;
  };
  rounds: Array<{
    roundNumber: number;
    saleType: string;
    tokensBought: number;
    amountPaid: number;
    purchaseDate: Date;
    tokenPrice: number;
  }>;
}

interface PortfolioStats {
  totalInvested: number;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  activePositions: number;
  totalProjects: number;
  averageROI: number;
  bestPerformer: string;
  worstPerformer: string;
}

interface UserPurchase {
  projectId: number;
  roundNumber: number;
  tokensPurchased: number;
  amountPaid: number;
  purchaseTime: number;
  buyer: string;
}

function usePortfolioData() {
  const { publicKey } = useWallet();
  const { data: projects } = useMultiPresaleProjects();
  const { data: userPurchases } = useUserPurchases(publicKey?.toString());

  return useMemo(() => {
    if (!userPurchases || !projects) {
      return { positions: [], stats: null };
    }

    // Group purchases by project
    const positionMap = new Map<number, PortfolioPosition>();

    userPurchases.forEach((purchase: UserPurchase) => {
      const project = projects.find(p => p.id === purchase.projectId);
      if (!project) return;

      const existing = positionMap.get(purchase.projectId);
      const purchaseAmount = Number(purchase.amountPaid) / 1e9; // Convert from lamports
      const tokenAmount = Number(purchase.tokensPurchased) / 1e9;
      const tokenPrice = purchaseAmount / tokenAmount;

      if (existing) {
        existing.tokensPurchased += tokenAmount;
        existing.totalInvested += purchaseAmount;
        existing.averagePrice = existing.totalInvested / existing.tokensPurchased;
        existing.rounds.push({
          roundNumber: purchase.roundNumber,
          saleType: 'Unknown', // Would need to fetch from round data
          tokensBought: tokenAmount,
          amountPaid: purchaseAmount,
          purchaseDate: new Date(Number(purchase.purchaseTime) * 1000),
          tokenPrice,
        });
      } else {
        // Mock current price and vesting data for demo
        const mockCurrentPrice = tokenPrice * (0.8 + Math.random() * 0.4); // ±20% from purchase price
        const mockVestedPercent = Math.random() * 0.6; // 0-60% vested

        positionMap.set(purchase.projectId, {
          projectId: purchase.projectId,
          projectName: project.name,
          projectDescription: project.description,
          projectStatus: project.status,
          tokensPurchased: tokenAmount,
          totalInvested: purchaseAmount,
          averagePrice: tokenPrice,
          currentPrice: mockCurrentPrice,
          unrealizedPnL: (mockCurrentPrice - tokenPrice) * tokenAmount,
          unrealizedPnLPercent: ((mockCurrentPrice - tokenPrice) / tokenPrice) * 100,
          vestingInfo: {
            totalTokens: tokenAmount,
            vestedTokens: tokenAmount * mockVestedPercent,
            claimedTokens: tokenAmount * mockVestedPercent * 0.5, // 50% of vested claimed
            nextVestingDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Next 90 days
            vestingProgress: mockVestedPercent * 100,
          },
          rounds: [{
            roundNumber: purchase.roundNumber,
            saleType: 'Unknown',
            tokensBought: tokenAmount,
            amountPaid: purchaseAmount,
            purchaseDate: new Date(Number(purchase.purchaseTime) * 1000),
            tokenPrice,
          }],
        });
      }
    });

    const positions = Array.from(positionMap.values());
    
    // Calculate portfolio stats
    const totalInvested = positions.reduce((sum, pos) => sum + pos.totalInvested, 0);
    const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice || 0) * pos.tokensPurchased, 0);
    const totalPnL = totalValue - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    const stats: PortfolioStats = {
      totalInvested,
      totalValue,
      totalPnL,
      totalPnLPercent,
      activePositions: positions.filter(p => p.projectStatus === 'active').length,
      totalProjects: positions.length,
      averageROI: positions.length > 0 ? positions.reduce((sum, pos) => sum + pos.unrealizedPnLPercent, 0) / positions.length : 0,
      bestPerformer: positions.sort((a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent)[0]?.projectName || '',
      worstPerformer: positions.sort((a, b) => a.unrealizedPnLPercent - b.unrealizedPnLPercent)[0]?.projectName || '',
    };

    return { positions, stats };
  }, [userPurchases, projects]);
}

function PortfolioOverview({ stats }: { stats: PortfolioStats | null }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Total Invested</p>
            <p className="text-2xl font-bold text-mountain-900">
              {stats.totalInvested.toFixed(2)} SOL
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Portfolio Value</p>
            <p className="text-2xl font-bold text-mountain-900">
              {stats.totalValue.toFixed(2)} SOL
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Total P&L</p>
            <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}{stats.totalPnL.toFixed(2)} SOL
            </p>
            <p className={`text-sm ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalPnLPercent >= 0 ? '+' : ''}{stats.totalPnLPercent.toFixed(2)}%
            </p>
          </div>
          <div className={`p-3 rounded-lg ${stats.totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            {stats.totalPnL >= 0 ? 
              <ArrowUpRight className="w-6 h-6 text-green-600" /> : 
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            }
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Active Projects</p>
            <p className="text-2xl font-bold text-mountain-900">
              {stats.activePositions}
            </p>
            <p className="text-sm text-mountain-600">
              of {stats.totalProjects} total
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: PortfolioPosition }) {
  const isProfit = position.unrealizedPnL >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-mountain-900">{position.projectName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              position.projectStatus === 'active' ? 'bg-green-100 text-green-800' :
              position.projectStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {position.projectStatus}
            </span>
          </div>
          <p className="text-sm text-mountain-600 line-clamp-2 mb-3">
            {position.projectDescription}
          </p>
        </div>
        
        <Link
          href={`/projects/${position.projectId}`}
          className="p-2 text-mountain-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Position Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-cream-50 rounded-lg p-3">
          <div className="text-xs text-mountain-600 mb-1">Tokens Held</div>
          <div className="font-semibold text-mountain-900">
            {position.tokensPurchased.toLocaleString()}
          </div>
          <div className="text-xs text-mountain-500">
            Avg: {position.averagePrice.toFixed(4)} SOL
          </div>
        </div>
        
        <div className="bg-cream-50 rounded-lg p-3">
          <div className="text-xs text-mountain-600 mb-1">Investment</div>
          <div className="font-semibold text-mountain-900">
            {position.totalInvested.toFixed(2)} SOL
          </div>
          <div className="text-xs text-mountain-500">
            {position.rounds.length} round{position.rounds.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* P&L */}
      <div className={`rounded-lg p-3 mb-4 ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-mountain-600 mb-1">Unrealized P&L</div>
            <div className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}{position.unrealizedPnL.toFixed(2)} SOL
            </div>
          </div>
          <div className={`text-right ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            <div className="flex items-center">
              {isProfit ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="font-semibold">
                {isProfit ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vesting Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-mountain-600 mb-2">
          <span>Vesting Progress</span>
          <span>{position.vestingInfo.vestingProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-mountain-200 rounded-full h-2 mb-2">
          <div 
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(position.vestingInfo.vestingProgress, 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-mountain-500">Vested</div>
            <div className="font-medium">{position.vestingInfo.vestedTokens.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-mountain-500">Claimed</div>
            <div className="font-medium">{position.vestingInfo.claimedTokens.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-mountain-500">Available</div>
            <div className="font-medium text-green-600">
              {(position.vestingInfo.vestedTokens - position.vestingInfo.claimedTokens).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="border-t pt-3">
        <div className="text-xs font-medium text-mountain-700 mb-2">Purchase History</div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {position.rounds.map((round, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-medium">Round {round.roundNumber}</span>
                <span className="text-mountain-500 ml-2">
                  {format(round.purchaseDate, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="text-right">
                <div className="font-medium">{round.tokensBought.toLocaleString()} tokens</div>
                <div className="text-mountain-500">{round.amountPaid.toFixed(2)} SOL</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionHistory({ positions }: { positions: PortfolioPosition[] }) {
  const allTransactions = useMemo(() => {
    const transactions: Array<{
      date: Date;
      type: 'purchase' | 'vest' | 'claim';
      projectName: string;
      amount: number;
      value: number;
      description: string;
    }> = [];

    positions.forEach(position => {
      position.rounds.forEach(round => {
        transactions.push({
          date: round.purchaseDate,
          type: 'purchase',
          projectName: position.projectName,
          amount: round.tokensBought,
          value: round.amountPaid,
          description: `Purchased ${round.tokensBought.toLocaleString()} tokens in Round ${round.roundNumber}`,
        });
      });
    });

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [positions]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-mountain-900 mb-4">Transaction History</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {allTransactions.map((tx, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                tx.type === 'purchase' ? 'bg-blue-100' :
                tx.type === 'vest' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                {tx.type === 'purchase' ? <DollarSign className="w-4 h-4 text-blue-600" /> :
                 tx.type === 'vest' ? <Clock className="w-4 h-4 text-yellow-600" /> :
                 <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
              <div>
                <div className="font-medium text-mountain-900">{tx.projectName}</div>
                <div className="text-sm text-mountain-600">{tx.description}</div>
                <div className="text-xs text-mountain-500">
                  {format(tx.date, 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-mountain-900">
                {tx.amount.toLocaleString()} tokens
              </div>
              <div className="text-sm text-mountain-600">
                {tx.value.toFixed(2)} SOL
              </div>
            </div>
          </div>
        ))}
        
        {allTransactions.length === 0 && (
          <div className="text-center py-8 text-mountain-500">
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <p>No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvestorPortfolio() {
  const { connected, publicKey } = useWallet();
  const { positions, stats } = usePortfolioData();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [sortBy, setSortBy] = useState('value');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPositions = useMemo(() => {
    let filtered = positions;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(pos => pos.projectStatus === filterStatus);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return (b.currentPrice || 0) * b.tokensPurchased - (a.currentPrice || 0) * a.tokensPurchased;
        case 'pnl':
          return b.unrealizedPnL - a.unrealizedPnL;
        case 'pnl-percent':
          return b.unrealizedPnLPercent - a.unrealizedPnLPercent;
        case 'investment':
          return b.totalInvested - a.totalInvested;
        case 'name':
          return a.projectName.localeCompare(b.projectName);
        default:
          return 0;
      }
    });
  }, [positions, sortBy, filterStatus]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Wallet className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-mountain-900 mb-6">
                Investor Portfolio
              </h1>
              <p className="text-mountain-600 mb-8">
                Connect your wallet to view your investment portfolio and track performance.
              </p>
              <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-6 !py-3 !rounded-lg !transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Investment Portfolio</h1>
            <p className="text-xl text-white/90">
              Track your token investments and monitor performance across all projects
            </p>
          </div>

          {/* Portfolio Overview */}
          <PortfolioOverview stats={stats} />

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-1 p-6">
                {[
                  { id: 'overview', label: 'Portfolio Overview', icon: BarChart3 },
                  { id: 'positions', label: 'Positions', icon: Target },
                  { id: 'history', label: 'Transaction History', icon: Activity },
                  { id: 'analytics', label: 'Performance Analytics', icon: PieChart },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTab === tab.id
                        ? 'bg-sky-600 text-white'
                        : 'text-mountain-600 hover:text-mountain-900 hover:bg-mountain-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {selectedTab === 'overview' && (
                <div className="space-y-6">
                  {stats && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-mountain-900 mb-4">Performance Summary</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-mountain-600">Average ROI:</span>
                              <span className={`font-semibold ${stats.averageROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.averageROI >= 0 ? '+' : ''}{stats.averageROI.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-mountain-600">Best Performer:</span>
                              <span className="font-semibold text-green-600">{stats.bestPerformer || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-mountain-600">Worst Performer:</span>
                              <span className="font-semibold text-red-600">{stats.worstPerformer || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-mountain-900 mb-4">Portfolio Allocation</h3>
                          <div className="space-y-3">
                            {positions.slice(0, 3).map((position, index) => {
                              const allocation = stats.totalValue > 0 
                                ? ((position.currentPrice || 0) * position.tokensPurchased / stats.totalValue) * 100 
                                : 0;
                              return (
                                <div key={index} className="flex justify-between items-center">
                                  <span className="text-mountain-600 truncate">{position.projectName}</span>
                                  <span className="font-semibold text-mountain-900">{allocation.toFixed(1)}%</span>
                                </div>
                              );
                            })}
                            {positions.length > 3 && (
                              <div className="text-center text-mountain-500 text-sm">
                                +{positions.length - 3} more projects
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {positions.length === 0 && (
                        <div className="text-center py-12">
                          <Target className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                            No Investments Yet
                          </h3>
                          <p className="text-mountain-600 mb-6">
                            Start building your portfolio by investing in token sale projects.
                          </p>
                          <Link
                            href="/marketplace"
                            className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
                          >
                            Explore Projects
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {selectedTab === 'positions' && (
                <div className="space-y-6">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-4">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400"
                      >
                        <option value="all">All Projects</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                      </select>
                      
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-2 border border-mountain-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400"
                      >
                        <option value="value">Portfolio Value</option>
                        <option value="pnl">Unrealized P&L</option>
                        <option value="pnl-percent">P&L Percentage</option>
                        <option value="investment">Investment Amount</option>
                        <option value="name">Project Name</option>
                      </select>
                    </div>
                    
                    <div className="text-sm text-mountain-600">
                      {filteredPositions.length} position{filteredPositions.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Positions Grid */}
                  {filteredPositions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredPositions.map(position => (
                        <PositionCard key={position.projectId} position={position} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Filter className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                        No Positions Found
                      </h3>
                      <p className="text-mountain-600">
                        No positions match your current filters.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'history' && (
                <TransactionHistory positions={positions} />
              )}

              {selectedTab === 'analytics' && (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                    Advanced Analytics
                  </h3>
                  <p className="text-mountain-600">
                    Detailed performance analytics and insights coming soon.
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