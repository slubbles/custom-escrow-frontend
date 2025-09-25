'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { X, CreditCard, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { usePurchaseTokens, useCalculatePurchaseCost } from '@/hooks/usePurchaseTokens';

interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectName: string;
  roundNumber: number;
  saleType: string;
  tokenPrice: number;
  maxTokensPerBuyer: number;
  saleEndTime: Date;
}

export function PurchaseDialog({
  isOpen,
  onClose,
  projectId,
  projectName,
  roundNumber,
  saleType,
  tokenPrice,
  maxTokensPerBuyer,
  saleEndTime
}: PurchaseDialogProps) {
  const { connected } = useWallet();
  const purchaseTokens = usePurchaseTokens();
  const calculateCost = useCalculatePurchaseCost();

  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [costBreakdown, setCostBreakdown] = useState<{
    subtotal: string;
    platformFee: string;
    total: string;
    pricePerToken: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Calculate cost when token amount changes
  useEffect(() => {
    const amount = parseFloat(tokenAmount);
    if (amount > 0 && !isNaN(amount)) {
      setIsCalculating(true);
      calculateCost(projectId, roundNumber, amount)
        .then(setCostBreakdown)
        .catch(console.error)
        .finally(() => setIsCalculating(false));
    } else {
      setCostBreakdown(null);
    }
  }, [tokenAmount, projectId, roundNumber, calculateCost]);

  const handlePurchase = async () => {
    if (!connected || !tokenAmount || !costBreakdown) return;

    const amount = parseFloat(tokenAmount);
    if (amount <= 0 || isNaN(amount)) return;

    try {
      const result = await purchaseTokens.mutateAsync({
        projectId,
        roundNumber,
        tokenAmount: amount,
        maxPrice: parseFloat(costBreakdown.total) * 1.05 // 5% slippage tolerance
      });

      if (result.success) {
        onClose();
        setTokenAmount('');
        setAgreedToTerms(false);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const isValidAmount = () => {
    const amount = parseFloat(tokenAmount);
    return amount > 0 && amount <= maxTokensPerBuyer && !isNaN(amount);
  };

  const timeRemaining = saleEndTime.getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
  const hoursRemaining = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mountain-200">
          <div>
            <h2 className="text-2xl font-bold text-mountain-900">Purchase Tokens</h2>
            <p className="text-mountain-600 mt-1">{projectName} - {saleType} Sale</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mountain-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-mountain-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sale Info */}
          <div className="bg-sky-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-mountain-700">Price per Token</span>
              <span className="font-semibold text-mountain-900">{tokenPrice} SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-mountain-700">Max Purchase</span>
              <span className="font-semibold text-mountain-900">{maxTokensPerBuyer.toLocaleString()} tokens</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-mountain-700">Time Remaining</span>
              <div className="flex items-center text-mountain-900 font-semibold">
                <Clock className="w-4 h-4 mr-1" />
                {daysRemaining}d {hoursRemaining}h
              </div>
            </div>
          </div>

          {!connected ? (
            /* Wallet Connection */
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-mountain-900 mb-2">Connect Your Wallet</h3>
              <p className="text-mountain-600 mb-6">You need to connect your wallet to purchase tokens.</p>
              <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-6 !py-3 !rounded-lg !transition-colors" />
            </div>
          ) : (
            <>
              {/* Token Amount Input */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Token Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    placeholder="Enter token amount"
                    min="0"
                    max={maxTokensPerBuyer}
                    step="0.01"
                    className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mountain-500 text-sm">
                    tokens
                  </div>
                </div>
                {parseFloat(tokenAmount) > maxTokensPerBuyer && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Amount exceeds maximum purchase limit
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              {isCalculating ? (
                <div className="bg-mountain-50 rounded-xl p-4">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-mountain-200 rounded w-1/2"></div>
                    <div className="h-4 bg-mountain-200 rounded w-1/3"></div>
                    <div className="h-4 bg-mountain-200 rounded w-2/3"></div>
                  </div>
                </div>
              ) : costBreakdown ? (
                <div className="bg-mountain-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-mountain-900">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Subtotal</span>
                      <span className="font-medium">{costBreakdown.subtotal} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Platform Fee (2.5%)</span>
                      <span className="font-medium">{costBreakdown.platformFee} SOL</span>
                    </div>
                    <div className="border-t border-mountain-200 pt-2">
                      <div className="flex justify-between font-semibold text-mountain-900">
                        <span>Total</span>
                        <span>{costBreakdown.total} SOL</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : tokenAmount && parseFloat(tokenAmount) > 0 ? (
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Unable to calculate cost. Please try again.</span>
                  </div>
                </div>
              ) : null}

              {/* Terms Agreement */}
              <div className="bg-golden-50 rounded-xl p-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms-agreement"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 text-sky-600 focus:ring-sky-500 border-mountain-300 rounded"
                  />
                  <label htmlFor="terms-agreement" className="text-sm text-mountain-700">
                    I understand that token purchases are subject to vesting schedules and acknowledge 
                    the risks associated with cryptocurrency investments. This is not financial advice.
                  </label>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={
                  !isValidAmount() || 
                  !costBreakdown || 
                  !agreedToTerms || 
                  purchaseTokens.isPending ||
                  isCalculating
                }
                className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 disabled:from-mountain-300 disabled:to-mountain-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
              >
                {purchaseTokens.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Processing Purchase...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Purchase {tokenAmount || '0'} Tokens
                  </div>
                )}
              </button>

              {/* Success Message */}
              {purchaseTokens.isSuccess && (
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Purchase completed successfully!</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {purchaseTokens.isError && (
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">
                      {purchaseTokens.error?.message || 'Purchase failed. Please try again.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Portfolio Reminder */}
              <div className="bg-sky-50 rounded-xl p-4">
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-sky-600 mr-2 mt-0.5" />
                  <div className="text-sm text-mountain-700">
                    <p className="font-medium mb-1">Track Your Investment</p>
                    <p>After purchase, visit your portfolio to monitor vesting schedules and claim tokens when available.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}