'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Navigation } from '@/components/Navigation';
import { Wallet, TrendingUp, Clock, Gift, Target, Calendar, DollarSign, AlertCircle, CheckCircle, Users, Activity } from 'lucide-react';
import { PortfolioInvestment } from '@/hooks/usePortfolio';
import { format } from 'date-fns';

function InvestmentCard({ investment }: { investment: PortfolioInvestment }) {
  const vestingProgress = investment.isVested ? 100 : 
    investment.vestingStartDate && investment.vestingEndDate ? 
    Math.max(0, Math.min(100, ((Date.now() - investment.vestingStartDate.getTime()) / 
    (investment.vestingEndDate.getTime() - investment.vestingStartDate.getTime())) * 100)) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-mountain-900">{investment.projectName}</h3>
          <p className="text-sm text-mountain-600">{investment.saleType} Sale - Round {investment.roundNumber}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-mountain-900">
            {investment.tokensPurchased.toLocaleString()}
          </div>
          <div className="text-sm text-mountain-500">Tokens</div>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-mountain-600">Invested</div>
          <div className="text-lg font-semibold text-mountain-900">{investment.totalInvested.toFixed(4)} SOL</div>
        </div>
        <div>
          <div className="text-sm text-mountain-600">Current Value</div>
          <div className="text-lg font-semibold text-mountain-900">{investment.currentValue.toFixed(4)} SOL</div>
        </div>
      </div>

      {/* P&L Display */}
      <div className="mb-4 p-3 rounded-lg bg-mountain-50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-mountain-600">P&L</span>
          <div className={`text-right ${investment.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <div className="font-semibold">
              {investment.pnl >= 0 ? '+' : ''}{investment.pnl.toFixed(4)} SOL
            </div>
            <div className="text-sm">
              ({investment.pnl >= 0 ? '+' : ''}{investment.pnlPercentage.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Vesting Progress */}
      {investment.vestingStartDate && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-mountain-600 mb-2">
            <span>Vesting Progress</span>
            <span>{vestingProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(vestingProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Token Status */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-lg font-semibold text-green-600">
            {investment.claimedTokens.toLocaleString()}
          </div>
          <div className="text-xs text-mountain-600">Claimed</div>
        </div>
        <div className="text-center p-2 bg-sky-50 rounded-lg">
          <div className="text-lg font-semibold text-sky-600">
            {investment.remainingTokens.toLocaleString()}
          </div>
          <div className="text-xs text-mountain-600">Remaining</div>
        </div>
      </div>

      {/* Purchase Date */}
      <div className="flex items-center text-sm text-mountain-600 mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        Purchased: {format(investment.purchaseDate, 'MMM dd, yyyy')}
      </div>

      {/* Action Buttons */}
      {investment.canClaim && (
        <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center">
          <Gift className="w-4 h-4 mr-2" />
          Claim {investment.remainingTokens.toLocaleString()} Tokens
        </button>
      )}
      
      {!investment.isVested && investment.nextClaimDate && (
        <div className="bg-golden-50 rounded-lg p-3 mt-4">
          <div className="flex items-center text-golden-700">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Next claim: {format(investment.nextClaimDate, 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      )}

      {investment.isVested && investment.remainingTokens === 0 && (
        <div className="bg-green-50 rounded-lg p-3 mt-4">
          <div className="flex items-center text-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Fully claimed</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioPage() {
  const { connected } = useWallet();
  const { data: portfolioData, isLoading } = usePortfolio();

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Wallet className="w-16 h-16 text-mountain-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-mountain-900 mb-4">
                Connect Your Wallet
              </h1>
              <p className="text-mountain-600 mb-8">
                Connect your wallet to view your investment portfolio and track your token holdings.
              </p>
              <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-8 !py-4 !rounded-lg !transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-32">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-golden-400 mx-auto animate-spin" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
                </div>
                <h2 className="text-2xl font-bold text-mountain-900 mb-2">Loading Your Portfolio</h2>
                <p className="text-mountain-600">Fetching your investment data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { investments, summary } = portfolioData || { investments: [], summary: { totalInvested: 0, totalCurrentValue: 0, totalPnL: 0, totalPnLPercentage: 0, totalProjects: 0, activeInvestments: 0, totalTokensClaimed: 0, totalPendingTokens: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-mountain-900 mb-4">Investment Portfolio</h1>
            <p className="text-xl text-mountain-600">Track your token sale investments and vesting schedules</p>
          </div>

          {/* Portfolio Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-mountain-900 mb-6">Portfolio Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-sky-50 rounded-xl">
                <DollarSign className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-mountain-900">{summary.totalInvested.toFixed(4)}</div>
                <div className="text-sm text-mountain-600">Total Invested (SOL)</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-mountain-900">{summary.totalCurrentValue.toFixed(4)}</div>
                <div className="text-sm text-mountain-600">Current Value (SOL)</div>
              </div>
              
              <div className={`text-center p-4 rounded-xl ${summary.totalPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-2xl font-bold ${summary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.totalPnL >= 0 ? '+' : ''}{summary.totalPnL.toFixed(4)}
                </div>
                <div className="text-sm text-mountain-600">P&L (SOL)</div>
                <div className={`text-xs ${summary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({summary.totalPnL >= 0 ? '+' : ''}{summary.totalPnLPercentage.toFixed(2)}%)
                </div>
              </div>
              
              <div className="text-center p-4 bg-golden-50 rounded-xl">
                <Target className="w-8 h-8 text-golden-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-mountain-900">{summary.totalProjects}</div>
                <div className="text-sm text-mountain-600">Projects</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-mountain-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-mountain-900">{summary.activeInvestments}</div>
                <div className="text-sm text-mountain-600">Active Investments</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{summary.totalTokensClaimed.toLocaleString()}</div>
                <div className="text-sm text-mountain-600">Tokens Claimed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-sky-600">{summary.totalPendingTokens.toLocaleString()}</div>
                <div className="text-sm text-mountain-600">Tokens Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investments */}
      <div className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {investments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Activity className="w-16 h-16 text-mountain-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">No Investments Yet</h3>
              <p className="text-mountain-600 mb-8 max-w-md mx-auto">
                You haven't made any token purchases yet. Browse active projects to start building your portfolio.
              </p>
              <a
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Browse Token Sales
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-mountain-900 mb-6">Your Investments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map((investment, index) => (
                  <InvestmentCard key={index} investment={investment} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}