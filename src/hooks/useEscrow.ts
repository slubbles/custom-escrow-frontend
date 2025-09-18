'use client';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { Program, AnchorProvider, BN, web3, setProvider } from '@coral-xyz/anchor';
import toast from 'react-hot-toast';

// Constants
const PROGRAM_ID = new PublicKey('HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4');
const PLATFORM_FEE_RECIPIENT = new PublicKey('9yWMwzQb47KGTPKBhCkPYDUcprDBTDQgXvTsc1VTZyPE');

// Interfaces
export interface TokenSale {
  seller: PublicKey;
  tokenMint: PublicKey;
  paymentMint: PublicKey;
  pricePerToken: BN;
  totalTokens: BN;
  tokensAvailable: BN;
  saleStartTime: BN;
  saleEndTime: BN;
  maxTokensPerBuyer: BN;
  platformFeeBps: number;
  platformFeeRecipient: PublicKey;
  isActive: boolean;
  isPaused: boolean;
  bump: number;
}

export interface BuyerAccount {
  buyer: PublicKey;
  tokenSale: PublicKey;
  tokensPurchased: BN;
  bump: number;
}

// PDA helper functions
const getTokenSalePDA = (seller: PublicKey, tokenMint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('token_sale'),
      seller.toBuffer(),
      tokenMint.toBuffer()
    ],
    PROGRAM_ID
  );
};

const getTokenVaultPDA = (tokenSalePDA: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('token_vault'),
      tokenSalePDA.toBuffer()
    ],
    PROGRAM_ID
  );
};

const getBuyerAccountPDA = (buyer: PublicKey, tokenSalePDA: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('buyer'),
      buyer.toBuffer(),
      tokenSalePDA.toBuffer()
    ],
    PROGRAM_ID
  );
};

// IDL for the escrow smart contract
const IDL = {
  address: "HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4",
  version: "0.1.0",
  name: "escrow",
  instructions: [
    {
      name: "initializeSale",
      accounts: [
        { name: "seller", isMut: true, isSigner: true },
        { name: "tokenSale", isMut: true, isSigner: false },
        { name: "tokenMint", isMut: false, isSigner: false },
        { name: "paymentMint", isMut: false, isSigner: false },
        { name: "sellerTokenAccount", isMut: true, isSigner: false },
        { name: "tokenVault", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false }
      ],
      args: [
        { name: "pricePerToken", type: "u64" },
        { name: "totalTokens", type: "u64" },
        { name: "saleStartTime", type: "i64" },
        { name: "saleEndTime", type: "i64" },
        { name: "maxTokensPerBuyer", type: "u64" },
        { name: "platformFeeBps", type: "u16" },
        { name: "platformFeeRecipient", type: "publicKey" }
      ]
    },
    {
      name: "buyTokens",
      accounts: [
        { name: "buyer", isMut: true, isSigner: true },
        { name: "tokenSale", isMut: true, isSigner: false },
        { name: "buyerAccount", isMut: true, isSigner: false },
        { name: "buyerPaymentAccount", isMut: true, isSigner: false },
        { name: "sellerPaymentAccount", isMut: true, isSigner: false },
        { name: "platformFeeAccount", isMut: true, isSigner: false },
        { name: "buyerTokenAccount", isMut: true, isSigner: false },
        { name: "tokenVault", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "tokenAmount", type: "u64" }
      ]
    },
    {
      name: "createBuyerAccount",
      accounts: [
        { name: "buyer", isMut: true, isSigner: true },
        { name: "tokenSale", isMut: false, isSigner: false },
        { name: "buyerAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: "initializeProgram",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: "TokenSale",
      type: {
        kind: "struct",
        fields: [
          { name: "seller", type: "publicKey" },
          { name: "tokenMint", type: "publicKey" },
          { name: "paymentMint", type: "publicKey" },
          { name: "pricePerToken", type: "u64" },
          { name: "totalTokens", type: "u64" },
          { name: "tokensAvailable", type: "u64" },
          { name: "saleStartTime", type: "i64" },
          { name: "saleEndTime", type: "i64" },
          { name: "maxTokensPerBuyer", type: "u64" },
          { name: "platformFeeBps", type: "u16" },
          { name: "platformFeeRecipient", type: "publicKey" },
          { name: "isActive", type: "bool" },
          { name: "isPaused", type: "bool" },
          { name: "bump", type: "u8" }
        ]
      }
    },
    {
      name: "BuyerAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "buyer", type: "publicKey" },
          { name: "tokenSale", type: "publicKey" },
          { name: "tokensPurchased", type: "u64" },
          { name: "bump", type: "u8" }
        ]
      }
    }
  ]
};

export function useEscrowProgram() {
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();

  const program = useMemo(() => {
    // Don't initialize if wallet not connected
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

      // Create actual program instance with real IDL
      const program = new Program(IDL as any, provider);
      console.log('Program initialized successfully');
      return program;
    } catch (error) {
      console.error('Error initializing program:', error);
      // Return null instead of throwing to prevent app crash
      return null;
    }
  }, [connection, wallet, publicKey]);

  return program;
}

// Hook to fetch all active sales
export function useActiveSales() {
  const program = useEscrowProgram();

  return useQuery({
    queryKey: ['activeSales'],
    queryFn: async () => {
      if (!program) {
        console.log('Program not initialized, skipping sales fetch');
        return [];
      }

      try {
        // Fetch all TokenSale accounts from the program
        const sales = await (program.account as any).tokenSale.all();
        
        // Filter for active sales only
        const activeSales = sales.filter((sale: any) => 
          sale.account.isActive && 
          !sale.account.isPaused &&
          sale.account.tokensAvailable.gt(new BN(0))
        );

        return activeSales;
      } catch (error) {
        console.error('Error fetching active sales:', error);
        throw error;
      }
    },
    enabled: !!program,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: 1000,
  });
}

// Hook to create a new token sale
export function useCreateSale() {
  const program = useEscrowProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tokenMint: PublicKey;
      paymentMint: PublicKey;
      pricePerToken: number;
      totalTokens: number;
      saleStartTime: number;
      saleEndTime: number;
      maxTokensPerBuyer: number;
      platformFeeBps: number;
      platformFeeRecipient: PublicKey;
    }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      const [tokenSalePDA] = getTokenSalePDA(publicKey, params.tokenMint);
      const [tokenVaultPDA] = getTokenVaultPDA(tokenSalePDA);
      
      // Get seller's token account
      const sellerTokenAccount = await getAssociatedTokenAddress(
        params.tokenMint,
        publicKey
      );

      // Initialize the token sale
      const tx = await (program.methods as any)
        .initializeSale(
          new BN(params.pricePerToken),
          new BN(params.totalTokens),
          new BN(params.saleStartTime),
          new BN(params.saleEndTime),
          new BN(params.maxTokensPerBuyer),
          params.platformFeeBps,
          params.platformFeeRecipient
        )
        .accounts({
          seller: publicKey,
          tokenSale: tokenSalePDA,
          tokenMint: params.tokenMint,
          paymentMint: params.paymentMint,
          sellerTokenAccount,
          tokenVault: tokenVaultPDA,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return { signature: tx, tokenSalePDA };
    },
    onSuccess: (data) => {
      toast.success('Token sale created successfully!');
      queryClient.invalidateQueries({ queryKey: ['activeSales'] });
    },
    onError: (error) => {
      console.error('Error creating sale:', error);
      toast.error('Failed to create token sale');
    },
  });
}

// Hook to buy tokens
export function useBuyTokens() {
  const program = useEscrowProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tokenSalePDA: PublicKey;
      tokenAmount: number;
      saleData: TokenSale;
    }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      try {
        // Get required PDAs
        const [buyerAccountPDA] = getBuyerAccountPDA(publicKey, params.tokenSalePDA);
        const [tokenVaultPDA] = getTokenVaultPDA(params.tokenSalePDA);

        // Get associated token accounts
        const buyerTokenAccount = await getAssociatedTokenAddress(
          params.saleData.tokenMint,
          publicKey
        );
        const buyerPaymentAccount = await getAssociatedTokenAddress(
          params.saleData.paymentMint,
          publicKey
        );

        // Build and send transaction
        const tx = await (program.methods as any)
          .buyTokens(new BN(params.tokenAmount))
          .accounts({
            buyer: publicKey,
            tokenSale: params.tokenSalePDA,
            buyerAccount: buyerAccountPDA,
            tokenVault: tokenVaultPDA,
            buyerTokenAccount,
            buyerPaymentAccount,
            platformFeeRecipient: params.saleData.platformFeeRecipient,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        return { signature: tx };
      } catch (error) {
        console.error('Error in buy tokens transaction:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success('Tokens purchased successfully!');
      queryClient.invalidateQueries({ queryKey: ['activeSales'] });
      queryClient.invalidateQueries({ queryKey: ['buyerHistory'] });
    },
    onError: (error) => {
      console.error('Error buying tokens:', error);
      toast.error('Failed to purchase tokens');
    },
  });
}

// Hook to fetch buyer's purchase history
export function useBuyerHistory() {
  const program = useEscrowProgram();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['buyerHistory', publicKey?.toString()],
    queryFn: async () => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      try {
        // Fetch all BuyerAccount accounts for this buyer
        const buyerAccounts = await (program.account as any).buyerAccount.all([
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: publicKey.toBase58(),
            },
          },
        ]);

        return buyerAccounts;
      } catch (error) {
        console.error('Error fetching buyer history:', error);
        // Return empty array as fallback
        return [];
      }
    },
    enabled: !!program && !!publicKey,
  });
}

// Hook to initialize the smart contract program (one-time setup)
export function useInitializeProgram() {
  const program = useEscrowProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      try {
        // Initialize the program with the authority (admin) wallet
        const tx = await (program.methods as any)
          .initializeProgram()
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        return { signature: tx };
      } catch (error) {
        console.error('Error initializing program:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success('Smart contract initialized successfully!');
      queryClient.invalidateQueries({ queryKey: ['activeSales'] });
    },
    onError: (error) => {
      console.error('Error initializing program:', error);
      toast.error('Failed to initialize smart contract');
    },
  });
}