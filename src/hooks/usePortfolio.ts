'use client';

import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

import { useMultiPresaleProgram } from './useMultiPresale';
import { 
  getMultiPresaleProjectPDA,
  getSaleRoundPDA,
  getRoundBuyerPDA 
} from '../lib/pdas';
import { MultiPresaleProject, SaleRound, RoundBuyerAccount } from '../lib/types';

export interface PortfolioInvestment {
  projectId: number;
  projectName: string;
  projectDescription: string;
  roundNumber: number;
  saleType: string;
  tokensPurchased: number;
  totalInvested: number; // In SOL
  currentValue: number; // In SOL (if trading)
  pnl: number; // Profit/Loss in SOL
  pnlPercentage: number; // P&L percentage
  purchaseDate: Date;
  vestingStartDate?: Date;
  vestingEndDate?: Date;
  claimedTokens: number;
  remainingTokens: number;
  isVested: boolean;
  canClaim: boolean;
  nextClaimDate?: Date;
}

export interface PortfolioSummary {
  totalInvested: number; // Total SOL invested
  totalCurrentValue: number; // Current portfolio value in SOL
  totalPnL: number; // Total profit/loss in SOL
  totalPnLPercentage: number; // Overall P&L percentage
  totalProjects: number; // Number of projects invested in
  activeInvestments: number; // Number of active investments
  totalTokensClaimed: number; // Total tokens claimed across all investments
  totalPendingTokens: number; // Total tokens pending claim
}

/**
 * Hook to fetch user's complete portfolio
 */
export function usePortfolio() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['userPortfolio', publicKey?.toString()],
    queryFn: async (): Promise<{
      investments: PortfolioInvestment[];
      summary: PortfolioSummary;
    }> => {
      if (!program || !publicKey) {
        return { investments: [], summary: getEmptyPortfolioSummary() };
      }

      try {
        // Fetch all buyer accounts for this user
        const buyerAccounts = await (program.account as any).roundBuyerAccount.all([
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: publicKey.toBase58(),
            },
          },
        ]);

        console.log(`Found ${buyerAccounts.length} investments for user`);

        const investments: PortfolioInvestment[] = [];
        let totalInvested = 0;
        let totalCurrentValue = 0;

        // Process each investment
        for (const buyerAccount of buyerAccounts) {
          try {
            const buyer: RoundBuyerAccount = buyerAccount.account;
            
            // Get project details
            const [projectPDA] = getMultiPresaleProjectPDA(buyer.projectId);
            const project: MultiPresaleProject = await (program.account as any).projectAccount.fetch(projectPDA);
            
            // Get sale round details
            const [saleRoundPDA] = getSaleRoundPDA(buyer.projectId, buyer.roundNumber);
            const saleRound: SaleRound = await (program.account as any).saleRound.fetch(saleRoundPDA);

            // Calculate investment metrics
            const tokensPurchased = buyer.tokensPurchased.toNumber() / Math.pow(10, 9); // Convert from lamports
            const totalCost = buyer.amountPaid.toNumber() / LAMPORTS_PER_SOL; // Convert to SOL
            const claimedTokens = 0; // TODO: Add claimedTokens field to smart contract
            const remainingTokens = tokensPurchased - claimedTokens;

            // For now, assume current value equals invested amount (no trading data)
            const currentValue = totalCost;
            const pnl = currentValue - totalCost;
            const pnlPercentage = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

            // Calculate vesting information  
            const purchaseDate = new Date(buyer.purchaseTime.toNumber() * 1000);
            // TODO: Add vesting fields to SaleRound smart contract
            const vestingStartDate = saleRound.endTime ? new Date(saleRound.endTime.toNumber() * 1000) : undefined;
            const vestingEndDate = vestingStartDate ? new Date(vestingStartDate.getTime() + (180 * 24 * 60 * 60 * 1000)) : undefined; // 6 months default
            
            const now = Date.now();
            const canClaim = vestingStartDate ? now >= vestingStartDate.getTime() : true;
            const isVested = vestingEndDate ? now >= vestingEndDate.getTime() : false;

            // Calculate next claim date (assuming monthly vesting)
            let nextClaimDate: Date | undefined;
            if (vestingStartDate && vestingEndDate && !isVested) {
              const monthsSinceStart = Math.floor((now - vestingStartDate.getTime()) / (30 * 24 * 60 * 60 * 1000));
              nextClaimDate = new Date(vestingStartDate.getTime() + (monthsSinceStart + 1) * (30 * 24 * 60 * 60 * 1000));
            }

            const investment: PortfolioInvestment = {
              projectId: buyer.projectId,
              projectName: project.name,
              projectDescription: project.description,
              roundNumber: buyer.roundNumber,
              saleType: Object.keys(saleRound.saleType)[0], // Get the enum key
              tokensPurchased,
              totalInvested: totalCost,
              currentValue,
              pnl,
              pnlPercentage,
              purchaseDate,
              vestingStartDate,
              vestingEndDate,
              claimedTokens,
              remainingTokens,
              isVested,
              canClaim: canClaim && remainingTokens > 0,
              nextClaimDate,
            };

            investments.push(investment);
            totalInvested += totalCost;
            totalCurrentValue += currentValue;

          } catch (error) {
            console.error('Error processing investment:', error);
            // Continue processing other investments
          }
        }

        // Calculate portfolio summary
        const totalPnL = totalCurrentValue - totalInvested;
        const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
        const totalTokensClaimed = investments.reduce((sum, inv) => sum + inv.claimedTokens, 0);
        const totalPendingTokens = investments.reduce((sum, inv) => sum + inv.remainingTokens, 0);

        const summary: PortfolioSummary = {
          totalInvested,
          totalCurrentValue,
          totalPnL,
          totalPnLPercentage,
          totalProjects: new Set(investments.map(inv => inv.projectId)).size,
          activeInvestments: investments.length,
          totalTokensClaimed,
          totalPendingTokens,
        };

        console.log('Portfolio summary:', summary);
        return { investments, summary };

      } catch (error) {
        console.error('Error fetching portfolio:', error);
        return { investments: [], summary: getEmptyPortfolioSummary() };
      }
    },
    enabled: !!program && !!publicKey,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}

/**
 * Hook to fetch investment details for a specific project
 */
export function useProjectInvestment(projectId: number) {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['projectInvestment', projectId, publicKey?.toString()],
    queryFn: async (): Promise<PortfolioInvestment[]> => {
      if (!program || !publicKey) {
        return [];
      }

      try {
        // Fetch all buyer accounts for this user and project
        const buyerAccounts = await (program.account as any).roundBuyerAccount.all([
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: publicKey.toBase58(),
            },
          },
        ]);

        // Filter for this specific project
        const projectInvestments = buyerAccounts.filter(
          (account: any) => account.account.projectId === projectId
        );

        const investments: PortfolioInvestment[] = [];

        for (const buyerAccount of projectInvestments) {
          // Process similar to main portfolio hook
          // ... (implementation similar to above)
        }

        return investments;
      } catch (error) {
        console.error('Error fetching project investment:', error);
        return [];
      }
    },
    enabled: !!program && !!publicKey && projectId !== undefined,
    refetchInterval: 15000,
    staleTime: 5000,
  });
}

/**
 * Helper function to get empty portfolio summary
 */
function getEmptyPortfolioSummary(): PortfolioSummary {
  return {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalPnL: 0,
    totalPnLPercentage: 0,
    totalProjects: 0,
    activeInvestments: 0,
    totalTokensClaimed: 0,
    totalPendingTokens: 0,
  };
}

/**
 * Hook to check if user can claim tokens from a specific investment
 */
export function useCanClaimTokens(projectId: number, roundNumber: number) {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['canClaimTokens', projectId, roundNumber, publicKey?.toString()],
    queryFn: async (): Promise<{
      canClaim: boolean;
      claimableAmount: number;
      nextClaimDate?: Date;
      totalRemaining: number;
    }> => {
      if (!program || !publicKey) {
        return { canClaim: false, claimableAmount: 0, totalRemaining: 0 };
      }

      try {
        const [buyerAccountPDA] = getRoundBuyerPDA(projectId, roundNumber, publicKey);
        const buyerAccount: RoundBuyerAccount = await (program.account as any).roundBuyerAccount.fetch(buyerAccountPDA);
        
        const [saleRoundPDA] = getSaleRoundPDA(projectId, roundNumber);
        const saleRound: SaleRound = await (program.account as any).saleRound.fetch(saleRoundPDA);

        const totalTokens = buyerAccount.tokensPurchased.toNumber() / Math.pow(10, 9);
        const claimedTokens = 0; // TODO: Add claimedTokens field to smart contract
        const totalRemaining = totalTokens - claimedTokens;

        // Check if vesting period has started
        const now = Date.now();
        // TODO: Add vesting fields to smart contract - using sale end time as proxy
        const vestingStart = saleRound.endTime.toNumber() * 1000;
        const vestingEnd = vestingStart + (180 * 24 * 60 * 60 * 1000); // 6 months default vesting

        if (now < vestingStart) {
          return { 
            canClaim: false, 
            claimableAmount: 0, 
            totalRemaining,
            nextClaimDate: new Date(vestingStart)
          };
        }

        // Calculate claimable amount based on vesting schedule
        let claimableAmount = 0;
        if (now >= vestingEnd) {
          // Fully vested
          claimableAmount = totalRemaining;
        } else {
          // Partially vested - calculate based on time elapsed
          const vestingDuration = vestingEnd - vestingStart;
          const timeElapsed = now - vestingStart;
          const vestingProgress = timeElapsed / vestingDuration;
          const totalVestedTokens = totalTokens * vestingProgress;
          claimableAmount = Math.max(0, totalVestedTokens - claimedTokens);
        }

        return {
          canClaim: claimableAmount > 0,
          claimableAmount,
          totalRemaining,
        };

      } catch (error) {
        console.error('Error checking claimable tokens:', error);
        return { canClaim: false, claimableAmount: 0, totalRemaining: 0 };
      }
    },
    enabled: !!program && !!publicKey && projectId !== undefined && roundNumber !== undefined,
    refetchInterval: 60000, // Check every minute
    staleTime: 30000,
  });
}