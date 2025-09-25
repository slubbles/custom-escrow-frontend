'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import toast from 'react-hot-toast';

import { useMultiPresaleProgram } from './useMultiPresale';
import { 
  getMultiPresaleProjectPDA,
  getSaleRoundPDA,
  getRoundBuyerPDA,
  getProjectVaultPDA,
  PLATFORM_FEE_RECIPIENT 
} from '../lib/pdas';
import { getAssociatedTokenAddress } from '../lib/solana';
import { TransactionResult, BuyTokensMultiPresaleParams } from '../lib/types';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface PurchaseTokensParams {
  projectId: number;
  roundNumber: number;
  tokenAmount: number; // In token units (not lamports)
  maxPrice?: number; // Optional slippage protection
}

/**
 * Hook to purchase tokens from a project sale round
 */
export function usePurchaseTokens() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PurchaseTokensParams): Promise<TransactionResult> => {
      if (!program || !publicKey || !program.provider) {
        throw new Error('Wallet not connected or program not initialized');
      }

      // Validate input parameters
      if (!params.projectId && params.projectId !== 0) {
        throw new Error('Project ID is required');
      }
      if (!params.roundNumber && params.roundNumber !== 0) {
        throw new Error('Round number is required');
      }
      if (!params.tokenAmount || params.tokenAmount <= 0) {
        throw new Error('Token amount must be greater than 0');
      }

      try {
        // Get all required PDAs
        const [projectPDA] = getMultiPresaleProjectPDA(params.projectId);
        const [saleRoundPDA] = getSaleRoundPDA(params.projectId, params.roundNumber);
        const [buyerAccountPDA] = getRoundBuyerPDA(params.projectId, params.roundNumber, publicKey);
        const [projectVaultPDA] = getProjectVaultPDA(params.projectId);

        // Fetch sale round data to get price and token info
        const saleRound = await (program.account as any).saleRound.fetch(saleRoundPDA);
        const project = await (program.account as any).projectAccount.fetch(projectPDA);

        // Calculate total cost
        const tokenAmountBN = new BN(params.tokenAmount * Math.pow(10, 9)); // Assuming 9 decimals
        const pricePerToken = saleRound.tokenPrice;
        const totalCost = tokenAmountBN.mul(pricePerToken);

        // Validate purchase limits
        if (tokenAmountBN.gt(saleRound.maxTokensPerBuyer)) {
          throw new Error(`Maximum purchase amount is ${saleRound.maxTokensPerBuyer.div(new BN(Math.pow(10, 9))).toString()} tokens`);
        }

        // Check if buyer account exists, create if not
        let buyerAccountExists = true;
        try {
          await (program.account as any).roundBuyerAccount.fetch(buyerAccountPDA);
        } catch {
          buyerAccountExists = false;
        }

        // Get token accounts
        const paymentMint = saleRound.paymentMint || new PublicKey('So11111111111111111111111111111111111111112'); // Default to SOL
        const buyerPaymentAccount = await getAssociatedTokenAddress(paymentMint, publicKey);
        const projectPaymentAccount = await getAssociatedTokenAddress(paymentMint, project.creator);
        const platformPaymentAccount = await getAssociatedTokenAddress(paymentMint, PLATFORM_FEE_RECIPIENT);

        let signature: string;

        if (!buyerAccountExists) {
          // Create buyer account first
          const createBuyerTx = await (program.methods as any)
            .createRoundBuyer()
            .accounts({
              buyer: publicKey,
              project: projectPDA,
              saleRound: saleRoundPDA,
              roundBuyer: buyerAccountPDA,
              systemProgram: new PublicKey('11111111111111111111111111111111'),
            })
            .transaction();

          await program.provider.sendAndConfirm!(createBuyerTx, [], {
            commitment: 'confirmed',
            maxRetries: 3,
          });

          console.log('Buyer account created successfully');
        }

        // Purchase tokens
        const purchaseTx = await (program.methods as any)
          .buyTokens(tokenAmountBN, params.maxPrice ? new BN(params.maxPrice) : totalCost)
          .accounts({
            buyer: publicKey,
            project: projectPDA,
            saleRound: saleRoundPDA,
            roundBuyer: buyerAccountPDA,
            projectVault: projectVaultPDA,
            buyerPaymentAccount: buyerPaymentAccount,
            projectPaymentAccount: projectPaymentAccount,
            platformPaymentAccount: platformPaymentAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: new PublicKey('11111111111111111111111111111111'),
          })
          .transaction();

        signature = await program.provider.sendAndConfirm!(purchaseTx, [], {
          commitment: 'confirmed',
          maxRetries: 3,
        });

        console.log('Tokens purchased successfully with signature:', signature);

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['multiPresaleProjects'] });
        queryClient.invalidateQueries({ queryKey: ['projectSaleRounds', params.projectId] });
        queryClient.invalidateQueries({ queryKey: ['userPortfolio'] });
        queryClient.invalidateQueries({ queryKey: ['roundBuyers'] });

        toast.success(`Successfully purchased ${params.tokenAmount} tokens!`);
        return { 
          signature, 
          success: true,
          data: {
            projectId: params.projectId,
            roundNumber: params.roundNumber,
            tokenAmount: params.tokenAmount,
            totalCost: totalCost.toString()
          }
        };

      } catch (error: any) {
        console.error('Purchase tokens error:', error);
        
        // Parse specific errors
        let errorMessage = 'Failed to purchase tokens';
        if (error.message?.includes('insufficient funds')) {
          errorMessage = 'Insufficient balance to complete purchase';
        } else if (error.message?.includes('sale not active')) {
          errorMessage = 'Sale is not currently active';
        } else if (error.message?.includes('exceeds maximum')) {
          errorMessage = 'Purchase amount exceeds maximum allowed';
        } else if (error.message?.includes('whitelist')) {
          errorMessage = 'You are not whitelisted for this sale round';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        return { signature: '', success: false, error: errorMessage };
      }
    },
  });
}

/**
 * Hook to calculate purchase cost with fees
 */
export function useCalculatePurchaseCost() {
  const program = useMultiPresaleProgram();

  return async (projectId: number, roundNumber: number, tokenAmount: number) => {
    if (!program) {
      throw new Error('Program not initialized');
    }

    try {
      const [saleRoundPDA] = getSaleRoundPDA(projectId, roundNumber);
      const saleRound = await (program.account as any).saleRound.fetch(saleRoundPDA);
      
      const tokenAmountBN = new BN(tokenAmount * Math.pow(10, 9));
      const pricePerToken = saleRound.tokenPrice;
      const subtotal = tokenAmountBN.mul(pricePerToken);
      
      // Calculate platform fee (assuming 2.5% platform fee)
      const platformFee = subtotal.mul(new BN(250)).div(new BN(10000));
      const total = subtotal.add(platformFee);

      return {
        subtotal: subtotal.div(new BN(LAMPORTS_PER_SOL)).toString(),
        platformFee: platformFee.div(new BN(LAMPORTS_PER_SOL)).toString(),
        total: total.div(new BN(LAMPORTS_PER_SOL)).toString(),
        pricePerToken: pricePerToken.div(new BN(LAMPORTS_PER_SOL)).toString()
      };
    } catch (error) {
      console.error('Error calculating purchase cost:', error);
      throw error;
    }
  };
}