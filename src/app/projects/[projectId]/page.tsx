'use client';

import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { PurchaseDialog } from '@/components/PurchaseDialog';
import { useMultiPresaleProject, useSaleRounds, useBuyTokensMultiPresale } from '@/hooks/useMultiPresale';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { 
  Clock, 
  Users, 
  Target,
  TrendingUp,
  ExternalLink,
  Twitter,
  MessageCircle,
  Send,
  Shield,
  Info,
  ChevronRight,
  CreditCard,
  CalendarDays,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { ProjectStatus, SaleRound } from '@/lib/types';
import { BN } from '@coral-xyz/anchor';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = parseInt(params.projectId as string);
  const { connected } = useWallet();
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedSaleRound, setSelectedSaleRound] = useState<SaleRound | null>(null);

  const { data: project, isLoading, error } = useMultiPresaleProject(projectId);
  const { data: saleRounds = [] } = useSaleRounds(projectId);
  const buyTokens = useBuyTokensMultiPresale();

  const handlePurchase = async () => {
    if (!connected || !purchaseAmount || selectedRound === null || !project) {
      toast.error('Please connect wallet and enter purchase amount');
      return;
    }

    try {
      const result = await buyTokens.mutateAsync({
        projectId,
        roundNumber: selectedRound,
        tokenAmount: new BN(parseFloat(purchaseAmount) * 1e9), // Convert to lamports
        maxPrice: new BN(parseFloat(purchaseAmount) * 1e9), // Use same as amount for now
      });

      if (result.success) {
        toast.success('Tokens purchased successfully!');
        setPurchaseAmount('');
      } else {
        toast.error('Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase tokens');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-mountain-200 rounded w-1/3"></div>
                <div className="h-4 bg-mountain-200 rounded w-2/3"></div>
                <div className="h-32 bg-mountain-200 rounded"></div>
                <div className="h-4 bg-mountain-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-2xl font-bold text-mountain-900 mb-4">Project Not Found</h1>
                              <p className="text-mountain-600">
                  The project you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeRounds = saleRounds.filter((round: SaleRound) => round.isActive) || [];
  const completedRounds = saleRounds.filter((round: SaleRound) => !round.isActive) || [];
  const totalRaised = project?.totalRaised ? Number(project.totalRaised) / 1e9 : 0; // Convert from lamports to SOL
  const targetAmount = project?.targetAmount ? Number(project.targetAmount) / 1e9 : 0; // Convert from lamports to SOL
  const progress = targetAmount > 0 ? (totalRaised / targetAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-12">
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">{project.name}</h1>
                <p className="text-xl text-white/90 mb-6">{project.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                    {project.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                    <Shield className="w-4 h-4 mr-1" />
                    Verified Project
                  </span>
                </div>

                {/* Social Links */}
                {(project.website || project.twitter || project.discord || project.telegram) && (
                  <div className="flex flex-wrap gap-4">
                    {project.website && (
                      <a 
                        href={project.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-white/90 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    )}
                    {project.twitter && (
                      <a 
                        href={project.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-white/90 hover:text-white transition-colors"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </a>
                    )}
                    {project.discord && (
                      <a 
                        href={project.discord} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-white/90 hover:text-white transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Discord
                      </a>
                    )}
                    {project.telegram && (
                      <a 
                        href={project.telegram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-white/90 hover:text-white transition-colors"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Telegram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-t border-mountain-200 px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-mountain-900">
                    {totalRaised.toFixed(2)} SOL
                  </div>
                  <div className="text-sm text-mountain-600">Total Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mountain-900">
                    {targetAmount.toFixed(2)} SOL
                  </div>
                  <div className="text-sm text-mountain-600">Target Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mountain-900">
                    {activeRounds.length}
                  </div>
                  <div className="text-sm text-mountain-600">Active Rounds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mountain-900">
                    {progress.toFixed(1)}%
                  </div>
                  <div className="text-sm text-mountain-600">Progress</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-mountain-600 mb-2">
                  <span>Funding Progress</span>
                  <span>{totalRaised.toFixed(2)} / {targetAmount.toFixed(2)} SOL</span>
                </div>
                <div className="w-full bg-mountain-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Sale Rounds */}
              {activeRounds.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-mountain-900 mb-6">
                    Active Sale Rounds
                  </h2>
                  
                  <div className="space-y-6">
                    {activeRounds.map((round, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-xl p-6 cursor-pointer transition-all ${
                          selectedRound === index 
                            ? 'border-sky-500 bg-sky-50' 
                            : 'border-mountain-200 hover:border-mountain-300'
                        }`}
                        onClick={() => setSelectedRound(selectedRound === index ? null : index)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-mountain-900">
                              Round {round.roundNumber}
                            </h3>
                            <p className="text-mountain-600">{round.saleType} Sale</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-mountain-900">
                              {(Number(round.tokenPrice) / 1e9).toFixed(4)} SOL per token
                            </div>
                            <div className="text-sm text-mountain-600">
                              Max: {(Number(round.maxTokensPerBuyer) / 1e9).toFixed(2)} tokens
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSaleRound(round);
                                setShowPurchaseDialog(true);
                              }}
                              className="mt-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center text-sm"
                            >
                              <CreditCard className="w-4 h-4 mr-1" />
                              Purchase
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-mountain-600">Sold</div>
                            <div className="font-medium">
                              {(Number(round.tokensSold) / 1e9).toFixed(2)} tokens
                            </div>
                          </div>
                          <div>
                            <div className="text-mountain-600">Total</div>
                            <div className="font-medium">
                              {(Number(round.totalTokens) / 1e9).toFixed(2)} tokens
                            </div>
                          </div>
                          <div>
                            <div className="text-mountain-600">Start Time</div>
                            <div className="font-medium">
                              {format(new Date(Number(round.startTime) * 1000), 'MMM dd, yyyy')}
                            </div>
                          </div>
                          <div>
                            <div className="text-mountain-600">End Time</div>
                            <div className="font-medium">
                              {format(new Date(Number(round.endTime) * 1000), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>

                        {Number(round.totalTokens) > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-mountain-600 mb-1">
                              <span>Round Progress</span>
                              <span>{((Number(round.tokensSold) / Number(round.totalTokens)) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-mountain-200 rounded-full h-2">
                              <div 
                                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((Number(round.tokensSold) / Number(round.totalTokens)) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Timeline */}
              {completedRounds.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-mountain-900 mb-6">
                    Completed Rounds
                  </h2>
                  
                  <div className="space-y-4">
                    {completedRounds.map((round, index) => (
                      <div key={index} className="border border-mountain-200 rounded-xl p-6 opacity-75">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-mountain-900">
                              Round {round.roundNumber}
                            </h3>
                            <p className="text-mountain-600">
                              Sold {(Number(round.tokensSold) / 1e9).toFixed(2)} / {(Number(round.totalTokens) / 1e9).toFixed(2)} tokens
                            </p>
                          </div>
                          <div className="flex items-center text-green-600">
                            <Check className="w-5 h-5 mr-2" />
                            Completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Purchase Widget */}
              {connected && activeRounds.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-mountain-900 mb-6">
                    Purchase Tokens
                  </h3>

                  {selectedRound !== null && activeRounds[selectedRound] && (
                    <>
                      <div className="mb-4 p-4 bg-sky-50 rounded-lg">
                        <div className="text-sm text-sky-800 mb-1">Selected Round</div>
                        <div className="font-semibold text-sky-900">
                          Round {activeRounds[selectedRound].roundNumber}
                        </div>
                        <div className="text-sm text-sky-700">
                          {(Number(activeRounds[selectedRound].tokenPrice) / 1e9).toFixed(4)} SOL per token
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-mountain-700 mb-2">
                            Amount (SOL)
                          </label>
                          <input
                            type="number"
                            value={purchaseAmount}
                            onChange={(e) => setPurchaseAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="0.01"
                            step="0.01"
                            className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                          />
                          <p className="mt-1 text-sm text-mountain-500">
                            Maximum: {(Number(activeRounds[selectedRound].maxTokensPerBuyer) / 1e9).toFixed(2)} tokens
                          </p>
                        </div>

                        {purchaseAmount && (
                          <div className="p-4 bg-cream-50 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>You&apos;ll receive:</span>
                              <span className="font-medium">
                                {(parseFloat(purchaseAmount) / (Number(activeRounds[selectedRound].tokenPrice) / 1e9)).toFixed(2)} tokens
                              </span>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handlePurchase}
                          disabled={
                            !purchaseAmount || 
                            parseFloat(purchaseAmount) < 0.01 ||
                            buyTokens.isPending
                          }
                          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                          {buyTokens.isPending ? 'Processing...' : 'Purchase Tokens'}
                        </button>
                      </div>
                    </>
                  )}

                  {selectedRound === null && (
                    <div className="text-center text-mountain-500 py-8">
                      <Info className="w-8 h-8 mx-auto mb-3 text-mountain-400" />
                      <p>Select a sale round above to purchase tokens</p>
                    </div>
                  )}
                </div>
              )}

              {/* Connect Wallet */}
              {!connected && (
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-mountain-900 mb-4">
                    Connect Your Wallet
                  </h3>
                  <p className="text-mountain-600 mb-6">
                    Connect your wallet to participate in this token sale.
                  </p>
                  <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-6 !py-3 !rounded-lg !transition-colors !w-full" />
                </div>
              )}

              {/* Project Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-mountain-900 mb-4">
                  Project Information
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-mountain-600">Token Mint:</span>
                    <span className="font-mono text-xs">{project.tokenMint.toString().slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mountain-600">Created:</span>
                    <span>{format(new Date(Number(project.createdAt) * 1000), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mountain-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      Object.keys(project.status)[0] === 'active' ? 'bg-green-100 text-green-800' :
                      Object.keys(project.status)[0] === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {Object.keys(project.status)[0].charAt(0).toUpperCase() + Object.keys(project.status)[0].slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Dialog */}
      {showPurchaseDialog && selectedSaleRound && project && (
        <PurchaseDialog
          isOpen={showPurchaseDialog}
          onClose={() => {
            setShowPurchaseDialog(false);
            setSelectedSaleRound(null);
          }}
          projectId={projectId}
          projectName={project.name}
          roundNumber={selectedSaleRound.roundNumber}
          saleType={Object.keys(selectedSaleRound.saleType)[0]}
          tokenPrice={Number(selectedSaleRound.tokenPrice) / 1e9}
          maxTokensPerBuyer={Number(selectedSaleRound.maxTokensPerBuyer) / 1e9}
          saleEndTime={new Date(Number(selectedSaleRound.endTime) * 1000)}
        />
      )}
    </div>
  );
}