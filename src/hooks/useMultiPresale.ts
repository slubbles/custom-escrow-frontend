'use client';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, AnchorProvider, BN, setProvider } from '@coral-xyz/anchor';
import toast from 'react-hot-toast';

// Import our types and utilities
import { 
  MultiPresaleProject,
  SaleRound,
  RoundBuyerAccount,
  PlatformAccount,
  ProjectCategory,
  ProjectStatus,
  SaleType,
  CreateMultiPresaleProjectParams,
  CreateSaleRoundParams,
  BuyTokensMultiPresaleParams,
  AddToWhitelistParams,
  UpdateProjectParams,
  TransactionResult 
} from '../lib/types';
import { 
  getPlatformPDA,
  getPlatformTreasuryPDA,
  getMultiPresaleProjectPDA,
  getSaleRoundPDA,
  getProjectVaultPDA,
  getRoundBuyerPDA,
  getProjectWhitelistPDA,
  MULTI_PRESALE_PROGRAM_ID,
  PLATFORM_FEE_RECIPIENT 
} from '../lib/pdas';
import { connection, MULTI_PRESALE_IDL, getAssociatedTokenAddress } from '../lib/solana';

/**
 * Hook to get the initialized Multi-Presale Anchor program
 */
export function useMultiPresaleProgram() {
  const { wallet, publicKey } = useWallet();

  const program = useMemo(() => {
    if (!wallet || !publicKey) {
      return null;
    }

    try {
      const provider = new AnchorProvider(
        connection,
        wallet.adapter as any,
        { 
          commitment: 'confirmed',
          preflightCommitment: 'confirmed'
        }
      );

      setProvider(provider);
      const program = new Program(MULTI_PRESALE_IDL, provider);
      console.log('Multi-Presale program initialized successfully');
      
      return program;
    } catch (error) {
      console.error('Failed to initialize multi-presale program:', error);
      return null;
    }
  }, [wallet, publicKey]);

  return program;
}



/**
 * Hook to fetch platform information
 */
export function usePlatformInfo() {
  const program = useMultiPresaleProgram();

  return useQuery({
    queryKey: ['platform', program?.programId.toString()],
    queryFn: async (): Promise<PlatformAccount | null> => {
      if (!program) {
        console.log('No program available for platform query');
        return null;
      }

      try {
        const [platformPDA] = getPlatformPDA();
        const platformAccount = await (program.account as any).platformAccount.fetch(platformPDA);
        
        console.log('Platform account fetched successfully');
        return platformAccount;
      } catch (error) {
        console.error('Error fetching platform info:', error);
        console.log('Platform may not be initialized yet');
        return null;
      }
    },
    enabled: !!program,
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

/**
 * Hook to fetch all projects
 */
export function useMultiPresaleProjects() {
  const program = useMultiPresaleProgram();

  return useQuery({
    queryKey: ['multiPresaleProjects', program?.programId.toString()],
    queryFn: async (): Promise<MultiPresaleProject[]> => {
      if (!program) {
        console.log('No program available for projects query');
        return [];
      }

      try {
        console.log('Attempting to fetch projects from multi-presale program:', program.programId.toString());
        
        // Fetch all project accounts
        const projectAccounts = await (program.account as any).projectAccount.all();
        
        const projects = projectAccounts.map((account: any) => ({
          id: account.account.id,
          creator: account.account.creator,
          name: account.account.name,
          description: account.account.description,
          category: account.account.category,
          website: account.account.website,
          tokenMint: account.account.tokenMint,
          status: account.account.status,
          createdAt: account.account.createdAt,
          totalRaised: account.account.totalRaised,
          targetAmount: account.account.targetAmount,
          currentRound: account.account.currentRound,
          totalRounds: account.account.totalRounds,
          bump: account.account.bump,
        }));

        console.log(`Found ${projects.length} projects`);
        return projects;
      } catch (error) {
        console.error('Error fetching projects:', error);
        console.log('This is normal if no projects have been created yet');
        return [];
      }
    },
    enabled: !!program,
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

/**
 * Hook to fetch a specific project
 */
export function useMultiPresaleProject(projectId?: number) {
  const program = useMultiPresaleProgram();

  return useQuery({
    queryKey: ['multiPresaleProject', program?.programId.toString(), projectId],
    queryFn: async (): Promise<MultiPresaleProject | null> => {
      if (!program || projectId === undefined) {
        return null;
      }

      try {
        const [projectPDA] = getMultiPresaleProjectPDA(projectId);
        const projectAccount = await (program.account as any).projectAccount.fetch(projectPDA);
        
        return {
          id: projectAccount.id,
          creator: projectAccount.creator,
          name: projectAccount.name,
          description: projectAccount.description,
          category: projectAccount.category,
          website: projectAccount.website,
          tokenMint: projectAccount.tokenMint,
          status: projectAccount.status,
          createdAt: projectAccount.createdAt,
          totalRaised: projectAccount.totalRaised,
          targetAmount: projectAccount.targetAmount,
          currentRound: projectAccount.currentRound,
          totalRounds: projectAccount.totalRounds,
          bump: projectAccount.bump,
        };
      } catch (error) {
        console.error('Error fetching project:', error);
        return null;
      }
    },
    enabled: !!program && projectId !== undefined,
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

/**
 * Hook to fetch sale rounds for a specific project
 */
export function useSaleRounds(projectId?: number) {
  const program = useMultiPresaleProgram();

  return useQuery({
    queryKey: ['saleRounds', program?.programId.toString(), projectId],
    queryFn: async (): Promise<SaleRound[]> => {
      if (!program || projectId === undefined) {
        return [];
      }

      try {
        // Fetch all sale rounds for this project
        const rounds = await (program.account as any).saleRound.all([
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: new BN(projectId).toArray('le', 8),
            },
          },
        ]);

        const saleRounds = rounds.map((round: any) => ({
          projectId: round.account.projectId,
          saleType: round.account.saleType,
          roundNumber: round.account.roundNumber,
          tokenPrice: round.account.tokenPrice,
          totalTokens: round.account.totalTokens,
          tokensSold: round.account.tokensSold,
          startTime: round.account.startTime,
          endTime: round.account.endTime,
          maxTokensPerBuyer: round.account.maxTokensPerBuyer,
          whitelistRequired: round.account.whitelistRequired,
          isActive: round.account.isActive,
          bump: round.account.bump,
        }));

        console.log(`Found ${saleRounds.length} sale rounds for project ${projectId}`);
        return saleRounds;
      } catch (error) {
        console.error('Error fetching sale rounds:', error);
        return [];
      }
    },
    enabled: !!program && projectId !== undefined,
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

/**
 * Hook to create a new project with enhanced validation and error handling
 */
export function useCreateMultiPresaleProject() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateMultiPresaleProjectParams): Promise<TransactionResult> => {
      if (!program || !publicKey || !program.provider) {
        throw new Error('Wallet not connected or program not initialized');
      }

      // Validate input parameters
      if (!params.name || params.name.length < 3) {
        throw new Error('Project name must be at least 3 characters long');
      }
      if (!params.description || params.description.length < 10) {
        throw new Error('Project description must be at least 10 characters long');
      }
      if (!params.tokenMint) {
        throw new Error('Token mint address is required');
      }
      if (!params.targetAmount || params.targetAmount <= 0) {
        throw new Error('Target amount must be greater than 0');
      }

      try {
        // Validate token mint address
        let tokenMint: PublicKey;
        try {
          tokenMint = new PublicKey(params.tokenMint);
        } catch {
          throw new Error('Invalid token mint address format');
        }

        // Get platform info first to get the next project ID
        const [platformPDA] = getPlatformPDA();
        let platformAccount;
        try {
          platformAccount = await (program.account as any).platformAccount.fetch(platformPDA);
        } catch {
          throw new Error('Platform not initialized. Please contact support.');
        }

        const projectId = platformAccount.totalProjects;
        const [projectPDA] = getMultiPresaleProjectPDA(projectId);
        const [projectVaultPDA] = getProjectVaultPDA(projectId);
        
        // Create project transaction with all social links
        const tx = await (program.methods as any)
          .createProject(
            params.name.trim(),
            params.description.trim(),
            { [params.category.toLowerCase()]: {} }, // Convert enum to object
            params.website?.trim() || '',
            new BN(Math.floor(params.targetAmount * LAMPORTS_PER_SOL)) // Convert to lamports
          )
          .accounts({
            creator: publicKey,
            platform: platformPDA,
            project: projectPDA,
            projectVault: projectVaultPDA,
            tokenMint: tokenMint,
            systemProgram: SystemProgram.programId,
          })
          .transaction();

        console.log('Sending create project transaction...');
        const signature = await program.provider.sendAndConfirm!(tx, [], {
          commitment: 'confirmed',
          maxRetries: 3,
        });
        
        console.log('Project created successfully with signature:', signature);
        
        // Invalidate and refetch projects
        queryClient.invalidateQueries({ queryKey: ['multiPresaleProjects'] });
        queryClient.invalidateQueries({ queryKey: ['platform'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] }); // Legacy compatibility

        toast.success(`Project "${params.name}" created successfully!`);
        return { 
          signature, 
          success: true, 
          data: { 
            projectId, 
            projectPDA: projectPDA.toString() 
          } 
        };
      } catch (error: any) {
        console.error('Create project error:', error);
        
        // Parse specific Solana errors
        let errorMessage = 'Failed to create project';
        if (error.message?.includes('insufficient funds')) {
          errorMessage = 'Insufficient SOL balance to create project';
        } else if (error.message?.includes('already in use')) {
          errorMessage = 'Project name already exists. Please choose a different name.';
        } else if (error.message?.includes('Transaction was not confirmed')) {
          errorMessage = 'Transaction failed to confirm. Please try again.';
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
 * Hook to create a sale round
 */
export function useCreateSaleRound() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateSaleRoundParams): Promise<TransactionResult> => {
      if (!program || !publicKey || !program.provider) {
        throw new Error('Wallet not connected or program not initialized');
      }

      try {
        const [projectPDA] = getMultiPresaleProjectPDA(params.projectId);
        const [saleRoundPDA] = getSaleRoundPDA(params.projectId, params.roundNumber);
        const [whitelistPDA] = getProjectWhitelistPDA(params.projectId, params.roundNumber);
        
        const tx = await (program.methods as any)
          .createSaleRound(
            { [params.saleType.toLowerCase()]: {} }, // Convert enum to object
            new BN(params.roundNumber),
            new BN(params.tokenPrice),
            new BN(params.totalTokens),
            new BN(params.startTime),
            new BN(params.endTime),
            new BN(params.maxTokensPerBuyer),
            params.whitelistRequired
          )
          .accounts({
            creator: publicKey,
            project: projectPDA,
            saleRound: saleRoundPDA,
            projectWhitelist: whitelistPDA,
            systemProgram: SystemProgram.programId,
          })
          .transaction();

        const signature = await program.provider.sendAndConfirm!(tx);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['saleRounds'] });
        queryClient.invalidateQueries({ queryKey: ['multiPresaleProject'] });

        toast.success(`${params.saleType} round created successfully!`);
        return { signature, success: true };
      } catch (error: any) {
        const errorMessage = error?.message || 'Failed to create sale round';
        console.error('Create sale round error:', error);
        toast.error(errorMessage);
        return { signature: '', success: false, error: errorMessage };
      }
    },
  });
}

/**
 * Hook to buy tokens from a sale round
 */
export function useBuyTokensMultiPresale() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: BuyTokensMultiPresaleParams): Promise<TransactionResult> => {
      if (!program || !publicKey || !program.provider) {
        throw new Error('Wallet not connected or program not initialized');
      }

      try {
        const [projectPDA] = getMultiPresaleProjectPDA(params.projectId);
        const [saleRoundPDA] = getSaleRoundPDA(params.projectId, params.roundNumber);
        const [roundBuyerPDA] = getRoundBuyerPDA(params.projectId, params.roundNumber, publicKey);
        const [projectVaultPDA] = getProjectVaultPDA(params.projectId);
        const [platformTreasuryPDA] = getPlatformTreasuryPDA();
        const [whitelistPDA] = getProjectWhitelistPDA(params.projectId, params.roundNumber);

        // For now, we'll use SOL as the payment mint (wrapped SOL)
        const paymentMint = new PublicKey('So11111111111111111111111111111111111111112');
        const buyerPaymentAccount = await getAssociatedTokenAddress(paymentMint, publicKey);

        const tx = await (program.methods as any)
          .buyTokens(params.tokenAmount)
          .accounts({
            buyer: publicKey,
            project: projectPDA,
            saleRound: saleRoundPDA,
            roundBuyerAccount: roundBuyerPDA,
            projectVault: projectVaultPDA,
            platformTreasury: platformTreasuryPDA,
            projectWhitelist: whitelistPDA,
            buyerPaymentAccount: buyerPaymentAccount,
            paymentMint: paymentMint,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .transaction();

        const signature = await program.provider.sendAndConfirm!(tx);
        
        toast.success('Tokens purchased successfully!');
        
        queryClient.invalidateQueries({ queryKey: ['saleRounds'] });
        queryClient.invalidateQueries({ queryKey: ['userMultiPresalePortfolio'] });
        
        return { signature, success: true };
      } catch (error: any) {
        console.error('Error buying tokens:', error);
        const errorMessage = error.message || 'Failed to purchase tokens';
        toast.error(errorMessage);
        return { signature: '', success: false, error: errorMessage };
      }
    },
  });
}

/**
 * Hook to get user's portfolio across all projects
 */
export function useUserMultiPresalePortfolio() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['userMultiPresalePortfolio', publicKey?.toString()],
    queryFn: async () => {
      if (!program || !publicKey) {
        return null;
      }

      try {
        // Fetch all round buyer accounts for this user
        const buyerAccounts = await (program.account as any).roundBuyerAccount.all([
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: publicKey.toBase58(),
            },
          },
        ]);

        // Group by project and calculate metrics
        const projectMap = new Map();
        
        for (const account of buyerAccounts) {
          const projectId = account.account.projectId;
          if (!projectMap.has(projectId)) {
            projectMap.set(projectId, {
              projectId,
              totalTokensPurchased: new BN(0),
              totalAmountPaid: new BN(0),
              rounds: [],
            });
          }
          
          const projectData = projectMap.get(projectId);
          projectData.totalTokensPurchased = projectData.totalTokensPurchased.add(account.account.tokensPurchased);
          projectData.totalAmountPaid = projectData.totalAmountPaid.add(account.account.amountPaid);
          projectData.rounds.push({
            roundNumber: account.account.roundNumber,
            tokensPurchased: account.account.tokensPurchased,
            amountPaid: account.account.amountPaid,
            purchaseTime: account.account.purchaseTime,
          });
        }

        const portfolio = Array.from(projectMap.values());

        return {
          totalInvestments: portfolio.length,
          totalTokensPurchased: portfolio.reduce((sum, p) => sum.add(p.totalTokensPurchased), new BN(0)),
          totalAmountPaid: portfolio.reduce((sum, p) => sum.add(p.totalAmountPaid), new BN(0)),
          projects: portfolio,
        };
      } catch (error) {
        console.error('Error fetching user portfolio:', error);
        return null;
      }
    },
    enabled: !!program && !!publicKey,
    refetchInterval: 30000,
  });
}

/**
 * Hook to initialize the platform (admin only)
 */
export function useInitializePlatform() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();

  return useMutation({
    mutationFn: async (params: {
      platformFee: number;
      minProjectDuration: number;
      maxProjectDuration: number;
    }): Promise<TransactionResult> => {
      if (!program || !publicKey) {
        throw new Error('Wallet not connected');
      }

      try {
        const [platformPDA] = getPlatformPDA();
        const [platformTreasuryPDA] = getPlatformTreasuryPDA();
        
        const tx = await (program.methods as any)
          .initializePlatform(
            params.platformFee,
            new BN(params.minProjectDuration),
            new BN(params.maxProjectDuration)
          )
          .accounts({
            authority: publicKey,
            platform: platformPDA,
            platformTreasury: platformTreasuryPDA,
            systemProgram: SystemProgram.programId,
          })
          .transaction();

        const signature = await program.provider.sendAndConfirm!(tx);
        
        toast.success('Platform initialized successfully!');
        
        return { 
          signature, 
          success: true,
          message: 'Platform initialization completed'
        };
      } catch (error: any) {
        console.error('❌ Error initializing platform:', error);
        const errorMessage = error.message || 'Failed to initialize platform';
        toast.error(errorMessage);
        return { signature: '', success: false, error: errorMessage };
      }
    },
  });
}

/**
 * Hook to add addresses to whitelist
 */
export function useAddToWhitelist() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddToWhitelistParams): Promise<TransactionResult> => {
      if (!program || !publicKey) {
        throw new Error('Wallet not connected');
      }

      try {
        const [projectPDA] = getMultiPresaleProjectPDA(params.projectId);
        const [whitelistPDA] = getProjectWhitelistPDA(params.projectId, params.roundNumber);
        
        const tx = await (program.methods as any)
          .addToWhitelist(params.addresses)
          .accounts({
            creator: publicKey,
            project: projectPDA,
            projectWhitelist: whitelistPDA,
          })
          .transaction();

        const signature = await program.provider.sendAndConfirm!(tx);
        
        toast.success(`Added ${params.addresses.length} addresses to whitelist`);
        
        queryClient.invalidateQueries({ queryKey: ['saleRounds'] });
        
        return { signature, success: true };
      } catch (error: any) {
        console.error('Error adding to whitelist:', error);
        const errorMessage = error.message || 'Failed to add to whitelist';
        toast.error(errorMessage);
        return { signature: '', success: false, error: errorMessage };
      }
    },
  });
}

/**
 * Hook to remove addresses from whitelist
 */
export function useRemoveFromWhitelist() {
  const program = useMultiPresaleProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddToWhitelistParams): Promise<TransactionResult> => {
      if (!program || !publicKey) {
        throw new Error('Wallet not connected');
      }

      try {
        const [projectPDA] = getMultiPresaleProjectPDA(params.projectId);
        const [whitelistPDA] = getProjectWhitelistPDA(params.projectId, params.roundNumber);
        
        const tx = await (program.methods as any)
          .removeFromWhitelist(params.addresses)
          .accounts({
            creator: publicKey,
            project: projectPDA,
            projectWhitelist: whitelistPDA,
          })
          .transaction();

        const signature = await program.provider.sendAndConfirm!(tx);
        
        toast.success(`Removed ${params.addresses.length} addresses from whitelist`);
        
        queryClient.invalidateQueries({ queryKey: ['saleRounds'] });
        
        return { signature, success: true };
      } catch (error: any) {
        console.error('Error removing from whitelist:', error);
        const errorMessage = error.message || 'Failed to remove from whitelist';
        toast.error(errorMessage);
        return { signature: '', success: false, error: errorMessage };
      }
    },
  });
}

/**
 * Hook to get user purchases
 */
export function useUserPurchases(userAddress?: string) {
  const program = useMultiPresaleProgram();

  return useQuery({
    queryKey: ['userPurchases', userAddress],
    queryFn: async () => {
      if (!program || !userAddress) {
        return [];
      }

      try {
        // Mock data for now - in real implementation, this would fetch from blockchain
        const mockPurchases = [
          {
            projectId: 1,
            roundNumber: 1,
            tokensPurchased: 1000,
            amountPaid: 500000000, // in lamports
            purchaseTime: Date.now() / 1000,
            buyer: userAddress,
          },
          {
            projectId: 2,
            roundNumber: 1,
            tokensPurchased: 2500,
            amountPaid: 1250000000, // in lamports
            purchaseTime: Date.now() / 1000 - 86400,
            buyer: userAddress,
          }
        ];

        return mockPurchases;
      } catch (error) {
        console.error('Error fetching user purchases:', error);
        return [];
      }
    },
    enabled: !!program && !!userAddress,
  });
}

/**
 * Hook to get platform treasury information
 */
export function usePlatformTreasury() {
  const { connection } = useConnection();
  const program = useMultiPresaleProgram();

  return useQuery({
    queryKey: ['platformTreasury'],
    queryFn: async () => {
      if (!program || !connection) {
        throw new Error('Program not initialized');
      }

      try {
        // Get platform treasury PDA
        const [treasuryPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('treasury')],
          program.programId
        );

        // Get treasury account balance
        const balance = await connection.getBalance(treasuryPDA);
        
        return {
          address: treasuryPDA.toString(),
          balance: balance / LAMPORTS_PER_SOL, // Convert to SOL
          balanceLamports: balance,
        };
      } catch (error) {
        console.error('Error fetching platform treasury:', error);
        return {
          address: '',
          balance: 0,
          balanceLamports: 0,
        };
      }
    },
    enabled: !!program && !!connection,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}