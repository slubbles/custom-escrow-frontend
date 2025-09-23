'use client';

import { useUserPortfolio } from '@/hooks/useEscrow';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Navigation } from '@/components/Navigation';
import { Wallet, TrendingUp, Clock, Gift, Lock, Unlock } from 'lucide-react';
import { BN } from '@coral-xyz/anchor';

function VestingCard({ holding }: { holding: any }) {
  // Calculate vesting progress
  const now = Math.floor(Date.now() / 1000);
  const vestingStart = holding.vestingSchedule.startTime.toNumber();
  const cliffEnd = vestingStart + holding.vestingSchedule.cliffDuration.toNumber();
  const vestingEnd = vestingStart + holding.vestingSchedule.vestingDuration.toNumber();
  
  const isCliffPassed = now >= cliffEnd;
  const isVestingComplete = now >= vestingEnd;
  
  const totalTokens = holding.tokensPurchased.toNumber();
  const claimedTokens = holding.claimedTokens.toNumber();
  
  let availableTokens = holding.claimableTokens.toNumber();

  const vestingProgress = isVestingComplete ? 100 : 
    isCliffPassed ? ((now - cliffEnd) / (vestingEnd - cliffEnd)) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-mountain-900">{holding.project.name}</h3>
          <p className="text-sm text-mountain-600">Vesting Schedule</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-mountain-900">
            {(totalTokens / 1e6).toLocaleString()}
          </div>
          <div className="text-sm text-mountain-500">Total Tokens</div>
        </div>
      </div>

      {/* Vesting Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-mountain-600 mb-2">
          <span>Vesting Progress</span>
          <span>{vestingProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-cream-200 rounded-full h-2">
          <div 
            className="bg-sky-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${vestingProgress}%` }}
          />
        </div>
      </div>

      {/* Token Distribution */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {(claimedTokens / 1e6).toLocaleString()}
          </div>
          <div className="text-xs text-mountain-500">Claimed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-sky-600">
            {(availableTokens / 1e6).toLocaleString()}
          </div>
          <div className="text-xs text-mountain-500">Available</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-mountain-400">
            {((totalTokens - claimedTokens - availableTokens) / 1e6).toLocaleString()}
          </div>
          <div className="text-xs text-mountain-500">Locked</div>
        </div>
      </div>

      {/* Vesting Timeline */}
      <div className="bg-cream-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center text-mountain-500 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              Cliff End
            </div>
            <div className="font-medium">
              {new Date(cliffEnd * 1000).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="flex items-center text-mountain-500 mb-1">
              <Unlock className="w-4 h-4 mr-1" />
              Vesting End
            </div>
            <div className="font-medium">
              {new Date(vestingEnd * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Button */}
      {availableTokens > 0 && (
        <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
          Claim {(availableTokens / 1e6).toLocaleString()} Tokens
        </button>
      )}

      {!isCliffPassed && (
        <div className="text-center py-3">
          <div className="flex items-center justify-center text-mountain-500">
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Cliff period ends in {Math.ceil((cliffEnd - now) / 86400)} days
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferralStats({ referralStats }: { referralStats: any }) {
  const totalReferrals = referralStats.totalReferrals;
  const totalBonus = referralStats.totalEarnings.toNumber();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-6">
      <div className="flex items-center mb-4">
        <Gift className="w-6 h-6 text-golden-600 mr-3" />
        <h3 className="text-lg font-semibold text-mountain-900">Referral Rewards</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-golden-600">{totalReferrals}</div>
          <div className="text-sm text-mountain-500">Total Referrals</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-golden-600">
            {(totalBonus / 1e6).toLocaleString()}
          </div>
          <div className="text-sm text-mountain-500">Bonus Tokens</div>
        </div>
      </div>

      {totalReferrals > 0 && (
        <div className="mt-4 pt-4 border-t border-cream-200">
          <h4 className="font-medium text-mountain-800 mb-2">Referral Summary</h4>
          <div className="text-sm text-mountain-600">
            You&apos;ve earned {(totalBonus / 1e6).toFixed(2)} bonus tokens from {totalReferrals} successful referrals.
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioPage() {
  const { connected, publicKey } = useWallet();
  const { data: portfolio, isLoading } = useUserPortfolio();

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Wallet className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-6">Your Portfolio</h1>
            <p className="text-xl text-white/90 mb-8">
              Connect your wallet to view your token investments and vesting schedules.
            </p>
            <WalletMultiButton className="!bg-white !text-mountain-900 hover:!bg-cream-100 !font-medium !px-6 !py-3 !rounded-lg !transition-colors" />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading portfolio...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalInvestmentValue = portfolio?.holdings?.reduce((sum: number, holding: any) => 
    sum + (holding.tokensPurchased.toNumber() * 0.1), 0) || 0; // Mock price calculation

  const totalTokens = portfolio?.holdings?.reduce((sum: number, holding: any) => 
    sum + holding.tokensPurchased.toNumber(), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Portfolio
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Track your investments, vesting schedules, and referral rewards.
            </p>
            
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="text-3xl font-bold text-white">
                  ${totalInvestmentValue.toLocaleString()}
                </div>
                <div className="text-white/80">Total Investment</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="text-3xl font-bold text-white">
                  {(totalTokens / 1e6).toLocaleString()}
                </div>
                <div className="text-white/80">Total Tokens</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="text-3xl font-bold text-white">
                  {portfolio?.holdings?.length || 0}
                </div>
                <div className="text-white/80">Active Investments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {portfolio && (portfolio.holdings?.length > 0 || portfolio.referralStats?.totalReferrals > 0) ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Vesting Schedules */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Vesting Schedules</h2>
                {portfolio.holdings?.map((holding: any, index: number) => (
                  <VestingCard key={index} holding={holding} />
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Referral Stats */}
                {portfolio.referralStats && portfolio.referralStats.totalReferrals > 0 && (
                  <ReferralStats referralStats={portfolio.referralStats} />
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-6">
                  <h3 className="text-lg font-semibold text-mountain-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Claim All Available
                    </button>
                    <button className="w-full border border-cream-300 text-mountain-700 hover:bg-cream-50 font-medium py-2 px-4 rounded-lg transition-colors">
                      Export Portfolio
                    </button>
                  </div>
                </div>

                {/* Portfolio Stats */}
                <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-6">
                  <h3 className="text-lg font-semibold text-mountain-900 mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Projects</span>
                      <span className="font-medium">{portfolio.holdings?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Referrals</span>
                      <span className="font-medium">{portfolio.referralStats?.totalReferrals || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Wallet</span>
                      <span className="font-medium font-mono text-xs">
                        {publicKey?.toString().slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Investments Yet</h3>
              <p className="text-white/70 mb-6">Start investing in token sales to see your portfolio here.</p>
              <button
                onClick={() => window.location.href = '/projects'}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Browse Projects
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}