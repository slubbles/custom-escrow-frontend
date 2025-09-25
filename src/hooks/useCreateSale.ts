import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import toast from 'react-hot-toast';
import { 
  TransactionResult,
  ProjectCategory,
  SaleType,
  CreateMultiPresaleProjectParams 
} from '@/lib/types';
import { useCreateMultiPresaleProject } from './useMultiPresale';

export interface CreateSaleFormData {
  // Project Info
  name: string;
  description: string;
  category: ProjectCategory;
  website?: string;
  twitter?: string;
  discord?: string;
  
  // Token Info
  tokenMint: string;
  tokenDecimals: number;
  totalTokensForSale: number;
  
  // Sale Configuration
  rounds: CreateSaleRoundData[];
  maxContributionPerUser: number;
  minContributionPerUser: number;
  
  // Vesting (optional)
  vestingEnabled: boolean;
  cliffDuration?: number; // in seconds
  vestingDuration?: number; // in seconds
  initialUnlockPercentage?: number; // 0-100
}

export interface CreateSaleRoundData {
  roundType: SaleType;
  pricePerToken: number; // in SOL
  tokensAllocated: number;
  startTime: Date;
  endTime: Date;
  maxTokensPerBuyer?: number;
  whitelistRequired: boolean;
}

export function useCreateSale() {
  const { publicKey } = useWallet();
  const createProject = useCreateMultiPresaleProject();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: CreateSaleFormData): Promise<TransactionResult> => {
      if (!publicKey) throw new Error('Wallet not connected');

      try {
        // Convert form data to CreateMultiPresaleProjectParams
        const projectParams: CreateMultiPresaleProjectParams = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          website: formData.website,
          twitter: formData.twitter,
          discord: formData.discord,
          tokenMint: formData.tokenMint,
          targetAmount: formData.totalTokensForSale * Math.min(...formData.rounds.map(r => r.pricePerToken)),
        };

        // Create the project using existing hook
        const result = await createProject.mutateAsync(projectParams);

        if (result.success && result.data) {
          // Project created successfully, now we could create sale rounds
          // For now, return the project creation result
          return {
            success: true,
            signature: result.signature,
            data: {
              ...result.data,
              roundCount: formData.rounds.length,
              totalTokensForSale: formData.totalTokensForSale,
            }
          };
        } else {
          return result;
        }

      } catch (error: any) {
        console.error('Sale creation error:', error);
        
        let errorMessage = 'Failed to create sale';
        if (error.message?.includes('insufficient funds')) {
          errorMessage = 'Insufficient SOL balance for transaction fees';
        } else if (error.message?.includes('token')) {
          errorMessage = 'Invalid token mint or insufficient token balance';
        } else if (error.message) {
          errorMessage = error.message;
        }

        return {
          success: false,
          signature: '',
          error: errorMessage
        };
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Sale created successfully!');
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['multi-presale-projects'] });
        queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      } else {
        toast.error(result.error || 'Failed to create sale');
      }
    },
    onError: (error: any) => {
      console.error('Sale creation mutation error:', error);
      toast.error('Failed to create sale');
    }
  });

  return mutation;
}

// Helper hook for validating token mints
export function useValidateTokenMint() {
  const { connection } = useConnection();

  return useMutation({
    mutationFn: async (mintAddress: string) => {
      try {
        const mintPubkey = new PublicKey(mintAddress);
        const mintInfo = await connection.getAccountInfo(mintPubkey);
        
        if (!mintInfo) {
          throw new Error('Token mint not found');
        }

        // Decode mint data to get decimals and supply
        const mintData = mintInfo.data;
        if (mintData.length !== 82) {
          throw new Error('Invalid mint account data');
        }

        const decimals = mintData[44];
        const supply = new BN(mintData.slice(36, 44), 'le');

        return {
          valid: true,
          decimals,
          supply: supply.toString(),
          mintAddress: mintPubkey.toString()
        };
      } catch (error: any) {
        return {
          valid: false,
          error: error.message || 'Invalid token mint'
        };
      }
    }
  });
}

// Helper hook for calculating sale metrics
export function useCalculateSaleMetrics() {
  return (rounds: CreateSaleRoundData[]) => {
    const totalTokens = rounds.reduce((sum, round) => sum + round.tokensAllocated, 0);
    const totalRaiseAmount = rounds.reduce((sum, round) => 
      sum + (round.tokensAllocated * round.pricePerToken), 0
    );
    const avgPricePerToken = totalRaiseAmount / totalTokens;
    const duration = Math.max(...rounds.map(r => r.endTime.getTime())) - Math.min(...rounds.map(r => r.startTime.getTime()));

    return {
      totalTokens,
      totalRaiseAmount,
      avgPricePerToken,
      duration: duration / (24 * 60 * 60 * 1000), // Convert to days
      roundCount: rounds.length
    };
  };
}