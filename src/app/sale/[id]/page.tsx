'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useBuyTokens } from '@/hooks/useEscrow';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import { 
  Clock, 
  Users, 
  Shield, 
  TrendingUp, 
  ExternalLink, 
  Calculator,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock SNRB sale data - in a real app, this would be fetched based on the ID
const getSNRBSaleData = (id: string) => {
  if (id === 'snrb') {
    return {
      id: 'snrb',
      tokenName: 'Snarbles',
      tokenSymbol: 'SNRB',
      tokenMint: 'So11111111111111111111111111111111111111112',
      paymentMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      description: 'Snarbles ($SNRB) is the utility token powering the next generation of no-code blockchain creation tools. Join the Snarbles ecosystem and unlock exclusive access to NFT creation tools across Solana and Algorand networks.',
      pricePerToken: 0.01,
      totalTokens: 10000000,
      tokensAvailable: 7500000,
      saleStartTime: Date.now() - 3600000, // Started 1 hour ago
      saleEndTime: Date.now() + 2592000000, // Ends in 30 days
      maxTokensPerBuyer: 100000,
      platformFeeBps: 300, // 3%
      seller: 'Snarbles Team',
      participants: 1247,
      raised: 25000,
      isActive: true,
      isPaused: false,
      website: 'https://snarbles.xyz',
      twitter: 'https://twitter.com/snarbles_xyz',
      discord: 'https://discord.gg/snarbles',
      benefits: [
        'Exclusive access to no-code NFT creation tools',
        'Reduced fees across all Snarbles platforms',
        'Early access to new blockchain integrations',
        'Premium support and priority features',
        'Governance rights in ecosystem decisions'
      ]
    };
  }
  
  // Default fallback for other IDs
  return {
    id: 1,
    tokenName: 'Sample Token',
    tokenSymbol: 'SAMPLE',
    tokenMint: 'So11111111111111111111111111111111111111112',
    paymentMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    description: 'This token sale is not available.',
    pricePerToken: 0.001,
    totalTokens: 1000000,
    tokensAvailable: 0,
    saleStartTime: Date.now(),
    saleEndTime: Date.now(),
    maxTokensPerBuyer: 0,
    platformFeeBps: 500,
    seller: 'Unknown',
    participants: 0,
    raised: 0,
    isActive: false,
    isPaused: true,
    website: '',
    twitter: '',
    discord: '',
  };
};

export default function SaleDetail() {
  const { id } = useParams();
  const { publicKey, connected } = useWallet();
  const buyTokensMutation = useBuyTokens();
  
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const saleData = getSNRBSaleData(id as string); // In real app: useSaleData(id)
  
  const progress = ((saleData.totalTokens - saleData.tokensAvailable) / saleData.totalTokens) * 100;
  const timeRemaining = saleData.saleEndTime - Date.now();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  const calculatePurchaseCost = () => {
    const amount = parseFloat(purchaseAmount) || 0;
    const grossCost = amount * saleData.pricePerToken;
    const platformFee = grossCost * (saleData.platformFeeBps / 10000);
    const totalCost = grossCost;
    
    return {
      tokenAmount: amount,
      grossCost,
      platformFee,
      totalCost,
      isValid: amount > 0 && amount <= saleData.tokensAvailable && (!saleData.maxTokensPerBuyer || amount <= saleData.maxTokensPerBuyer)
    };
  };

  const purchaseCalculation = calculatePurchaseCost();

  const handlePurchase = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!purchaseCalculation.isValid) {
      toast.error('Invalid purchase amount');
      return;
    }

    try {
      await buyTokensMutation.mutateAsync({
        tokenSalePDA: new PublicKey('11111111111111111111111111111112'), // Mock PDA
        tokenAmount: purchaseCalculation.tokenAmount,
        saleData: saleData as any,
      });
      
      setPurchaseAmount('');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-mountain py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-landscape rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{saleData.tokenSymbol[0]}</span>
              </div>
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-2 text-shadow-lg">
                  {saleData.tokenName}
                </h1>
                <p className="text-xl text-white/90 text-shadow">${saleData.tokenSymbol}</p>
              </div>
            </div>
            
            <div className="hidden md:block bg-white/20 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">${saleData.pricePerToken}</div>
                <div className="text-sm opacity-80">per token</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Stats */}
      <section className="py-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-forest-600">
                ${saleData.raised.toLocaleString()}
              </div>
              <div className="text-mountain-600 text-sm">Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-mountain-900">
                {progress.toFixed(1)}%
              </div>
              <div className="text-mountain-600 text-sm">Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-sky-600">
                {saleData.participants}
              </div>
              <div className="text-mountain-600 text-sm">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-golden-600">
                {saleData.tokensAvailable.toLocaleString()}
              </div>
              <div className="text-mountain-600 text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-coral-600">
                {daysRemaining}d {hoursRemaining}h
              </div>
              <div className="text-mountain-600 text-sm">Remaining</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Sale Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress */}
              <div className="card">
                <h2 className="text-2xl font-bold text-mountain-900 mb-6">Sale Progress</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-mountain-600">
                      {(saleData.totalTokens - saleData.tokensAvailable).toLocaleString()} / {saleData.totalTokens.toLocaleString()} tokens sold
                    </span>
                    <span className="font-semibold text-mountain-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-mountain-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-landscape rounded-full h-3 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-forest-50 rounded-lg">
                    <Clock className="w-8 h-8 text-forest-600 mx-auto mb-2" />
                    <div className="text-sm text-mountain-600">Time Left</div>
                    <div className="font-bold text-mountain-900">
                      {daysRemaining}d {hoursRemaining}h {minutesRemaining}m
                    </div>
                  </div>
                  <div className="text-center p-4 bg-sky-50 rounded-lg">
                    <Users className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                    <div className="text-sm text-mountain-600">Participants</div>
                    <div className="font-bold text-mountain-900">{saleData.participants}</div>
                  </div>
                  <div className="text-center p-4 bg-golden-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-golden-600 mx-auto mb-2" />
                    <div className="text-sm text-mountain-600">Avg. Purchase</div>
                    <div className="font-bold text-mountain-900">
                      ${(saleData.raised / saleData.participants).toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card">
                <h2 className="text-2xl font-bold text-mountain-900 mb-6">About {saleData.tokenName}</h2>
                <p className="text-mountain-700 leading-relaxed mb-6">
                  {saleData.description}
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mountain-900">Key Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Token Symbol:</span>
                      <span className="font-semibold">{saleData.tokenSymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Total Supply:</span>
                      <span className="font-semibold">{saleData.totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Price:</span>
                      <span className="font-semibold">${saleData.pricePerToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Platform Fee:</span>
                      <span className="font-semibold">{(saleData.platformFeeBps / 100).toFixed(2)}%</span>
                    </div>
                    {saleData.maxTokensPerBuyer && (
                      <div className="flex justify-between">
                        <span className="text-mountain-600">Max per Buyer:</span>
                        <span className="font-semibold">{saleData.maxTokensPerBuyer.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  {saleData.website && (
                    <a 
                      href={saleData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                  {saleData.twitter && (
                    <a 
                      href={saleData.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Twitter</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Benefits Section - Only for SNRB */}
              {saleData.id === 'snrb' && saleData.benefits && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-mountain-900 mb-6">$SNRB Holder Benefits</h2>
                  <div className="space-y-4">
                    {saleData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-forest-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-mountain-700 leading-relaxed">{benefit}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-sky-50 to-forest-50 rounded-lg border border-forest-200">
                    <h4 className="font-semibold text-mountain-900 mb-2">🌐 Multi-Chain Ecosystem</h4>
                    <p className="text-sm text-mountain-600">
                      Snarbles operates on <strong>Solana Devnet</strong> and <strong>Algorand Mainnet</strong>, 
                      with plans to expand to additional networks. Your $SNRB tokens unlock tools across our entire ecosystem.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Purchase Interface */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <div className="card-elevated sticky top-8">
                <h2 className="text-2xl font-bold text-mountain-900 mb-6">Purchase Tokens</h2>
                
                {!connected ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-mountain-300 mx-auto mb-4" />
                    <p className="text-mountain-600 mb-4">Connect your wallet to purchase tokens</p>
                    <button className="btn-primary w-full">
                      Connect Wallet
                    </button>
                  </div>
                ) : !saleData.isActive ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-coral-500 mx-auto mb-4" />
                    <p className="text-mountain-600 mb-4">This sale is not currently active</p>
                  </div>
                ) : saleData.isPaused ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-golden-500 mx-auto mb-4" />
                    <p className="text-mountain-600 mb-4">This sale is temporarily paused</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-semibold text-mountain-700 mb-2">
                        Number of Tokens
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className="input-field pr-20"
                          placeholder="0"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(e.target.value)}
                          max={saleData.tokensAvailable}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mountain-600 text-sm">
                          {saleData.tokenSymbol}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-mountain-600">
                        <span>Available: {saleData.tokensAvailable.toLocaleString()}</span>
                        {saleData.maxTokensPerBuyer && (
                          <span>Max: {saleData.maxTokensPerBuyer.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[25, 50, 75, 100].map((percentage) => {
                        const amount = Math.floor((saleData.tokensAvailable * percentage) / 100);
                        const maxAmount = saleData.maxTokensPerBuyer ? Math.min(amount, saleData.maxTokensPerBuyer) : amount;
                        return (
                          <button
                            key={percentage}
                            type="button"
                            className="btn-outline text-xs py-2"
                            onClick={() => setPurchaseAmount(maxAmount.toString())}
                          >
                            {percentage}%
                          </button>
                        );
                      })}
                    </div>

                    {/* Cost Breakdown */}
                    {purchaseCalculation.tokenAmount > 0 && (
                      <div className="p-4 bg-mountain-50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <Calculator className="w-4 h-4 text-mountain-600" />
                          <span className="text-mountain-600">Cost Breakdown</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-mountain-600">Tokens:</span>
                            <span>{purchaseCalculation.tokenAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-mountain-600">Price per token:</span>
                            <span>${saleData.pricePerToken}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-mountain-600">Subtotal:</span>
                            <span>${purchaseCalculation.grossCost.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-mountain-600">Platform fee ({(saleData.platformFeeBps / 100).toFixed(2)}%):</span>
                            <span>${purchaseCalculation.platformFee.toFixed(6)}</span>
                          </div>
                          <div className="border-t border-mountain-200 pt-1 mt-2">
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>${purchaseCalculation.totalCost.toFixed(6)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Purchase Button */}
                    <button
                      onClick={handlePurchase}
                      disabled={!purchaseCalculation.isValid || buyTokensMutation.isPending}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {buyTokensMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Purchasing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Purchase Tokens</span>
                        </>
                      )}
                    </button>

                    {!purchaseCalculation.isValid && purchaseCalculation.tokenAmount > 0 && (
                      <div className="text-center text-sm text-coral-600">
                        {purchaseCalculation.tokenAmount > saleData.tokensAvailable 
                          ? 'Amount exceeds available tokens'
                          : saleData.maxTokensPerBuyer && purchaseCalculation.tokenAmount > saleData.maxTokensPerBuyer
                          ? 'Amount exceeds maximum per buyer'
                          : 'Invalid amount'
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sale Status */}
              <div className="card">
                <h3 className="text-lg font-semibold text-mountain-900 mb-4">Sale Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-mountain-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      saleData.isActive && !saleData.isPaused 
                        ? 'bg-forest-100 text-forest-700' 
                        : 'bg-coral-100 text-coral-700'
                    }`}>
                      {saleData.isActive && !saleData.isPaused ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mountain-600">Seller:</span>
                    <span className="font-mono text-xs">{saleData.seller}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mountain-600">Start Time:</span>
                    <span className="text-sm">{new Date(saleData.saleStartTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mountain-600">End Time:</span>
                    <span className="text-sm">{new Date(saleData.saleEndTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}