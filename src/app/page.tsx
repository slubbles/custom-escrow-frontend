'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useBuyTokens, useActiveSales } from '@/hooks/useEscrow';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Shield, Calculator, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { publicKey, connected } = useWallet();
  const buyTokensMutation = useBuyTokens();
  const { data: activeSales, isLoading: salesLoading, error: salesError } = useActiveSales();
  const [purchaseAmount, setPurchaseAmount] = useState('');

  // Get the first active sale (SNRB sale)
  const saleData = activeSales?.[0];
  
  if (salesLoading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
          <div className="text-center">
            <Loader className="w-16 h-16 text-mountain-600 mx-auto mb-4 animate-spin" />
            <p className="text-xl text-mountain-600">Loading token sale...</p>
          </div>
        </section>
      </main>
    );
  }

  // If there's an error or no sales data, show a message about initialization
  if (salesError || !saleData) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-landscape rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-4xl">S</span>
            </div>
            <h1 className="text-4xl font-bold text-mountain-900 mb-4">Contract Setup Required</h1>
            <p className="text-xl text-mountain-600 mb-8">
              The smart contract needs to be initialized and a token sale created before users can purchase tokens.
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-left">
              <h3 className="font-semibold text-mountain-900 mb-3">Next Steps:</h3>
              <ol className="text-mountain-700 space-y-2">
                <li>1. Connect your admin wallet</li>
                <li>2. Go to the <a href="/admin" className="text-forest-600 hover:underline">Admin Panel</a></li>
                <li>3. Initialize the smart contract</li>
                <li>4. Create a new token sale</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Convert blockchain data to display format
  const tokenSymbol = 'SNRB';
  const pricePerToken = saleData.account.pricePerToken.toNumber() / 1e9; // Convert from lamports to SOL
  const totalTokens = saleData.account.totalTokens.toNumber() / 1e9; // Convert from smallest unit
  const tokensAvailable = saleData.account.tokensAvailable.toNumber() / 1e9;
  const maxTokensPerBuyer = saleData.account.maxTokensPerBuyer?.toNumber() / 1e9;
  const saleEndTime = saleData.account.saleEndTime.toNumber() * 1000; // Convert to milliseconds
  
  const progress = ((totalTokens - tokensAvailable) / totalTokens) * 100;
  const timeRemaining = saleEndTime - Date.now();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const tokensRaised = totalTokens - tokensAvailable;
  const totalRaised = tokensRaised * pricePerToken;

  const calculatePurchaseCost = () => {
    const amount = parseFloat(purchaseAmount) || 0;
    const grossCost = amount * pricePerToken;
    const totalCost = grossCost;

    return {
      tokenAmount: amount,
      grossCost,
      totalCost,
      isValid: amount > 0 && amount <= tokensAvailable && (!maxTokensPerBuyer || amount <= maxTokensPerBuyer)
    };
  };  const purchaseCalculation = calculatePurchaseCost();

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
        tokenSalePDA: saleData.publicKey,
        tokenMint: saleData.account.tokenMint,
        paymentMint: saleData.account.paymentMint,
        tokenAmount: purchaseCalculation.tokenAmount,
      });

      setPurchaseAmount('');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
        <div className="max-w-5xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-center lg:text-left">
              <div className="w-24 h-24 bg-gradient-landscape rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <span className="text-white font-bold text-4xl">S</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-mountain-900 mb-4">
                Buy ${tokenSymbol}
              </h1>

              <p className="text-2xl text-mountain-600 mb-8">
                ${pricePerToken} SOL per token
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-3xl font-bold text-forest-600">
                    {totalRaised.toFixed(2)} SOL
                  </div>
                  <div className="text-mountain-600">Raised</div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-3xl font-bold text-mountain-900">
                    {progress.toFixed(1)}%
                  </div>
                  <div className="text-mountain-600">Sold</div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-3xl font-bold text-sky-600">
                    {tokensRaised.toLocaleString()}
                  </div>
                  <div className="text-mountain-600">Tokens Sold</div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-3xl font-bold text-coral-600">
                    {daysRemaining}d
                  </div>
                  <div className="text-mountain-600">Left</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-mountain-600">
                  <span>{tokensRaised.toLocaleString()} sold</span>
                  <span>{tokensAvailable.toLocaleString()} remaining</span>
                </div>
                <div className="w-full bg-mountain-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-landscape rounded-full h-4 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="card-elevated max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-mountain-900 mb-8 text-center">Purchase Tokens</h2>
              
              {!connected ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-mountain-300 mx-auto mb-6" />
                  <p className="text-mountain-600 mb-6">Connect wallet to buy tokens</p>
                  <button className="btn-primary w-full text-lg py-4">
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-mountain-700 mb-3">
                      Number of Tokens
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="input-field pr-20 text-xl py-4"
                        placeholder="0"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                        max={tokensAvailable}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-mountain-600 font-bold text-lg">
                        {tokenSymbol}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-mountain-600">
                      Max: {maxTokensPerBuyer?.toLocaleString()} tokens
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[1000, 5000, 10000, 25000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className="btn-outline py-4 text-lg font-semibold"
                        onClick={() => setPurchaseAmount(amount.toString())}
                      >
                        {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {purchaseCalculation.tokenAmount > 0 && (
                    <div className="p-6 bg-mountain-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Calculator className="w-5 h-5 text-mountain-600" />
                        <span className="text-mountain-600 font-semibold">Cost Breakdown</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-mountain-600">Tokens:</span>
                          <span className="font-semibold">{purchaseCalculation.tokenAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mountain-600">Price:</span>
                          <span className="font-semibold">{pricePerToken} SOL</span>
                        </div>
                        <div className="border-t border-mountain-200 pt-2 mt-3">
                          <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span className="text-forest-600">{purchaseCalculation.totalCost.toFixed(4)} SOL</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePurchase}
                    disabled={!purchaseCalculation.isValid || buyTokensMutation.isPending}
                    className="btn-primary w-full text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {buyTokensMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span>Buy Tokens</span>
                      </>
                    )}
                  </button>

                  {!purchaseCalculation.isValid && purchaseCalculation.tokenAmount > 0 && (
                    <div className="text-center text-coral-600 font-semibold">
                      {purchaseCalculation.tokenAmount > tokensAvailable
                        ? 'Amount exceeds available tokens'
                        : maxTokensPerBuyer && purchaseCalculation.tokenAmount > maxTokensPerBuyer
                        ? 'Amount exceeds maximum per buyer'
                        : 'Invalid amount'
                      }
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
