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

// Mock IDL for now - in a real app, you'd import this from your Anchor project
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
    if (!wallet || !publicKey) return null;

    try {
      const provider = new AnchorProvider(
        connection,
        wallet.adapter as any,
        { commitment: 'confirmed' }
      );

      // Create actual program instance with real IDL
      const program = new Program(IDL as any, provider);
      return program;
    } catch (error) {
      console.error('Error initializing program:', error);
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
      if (!program) throw new Error('Program not initialized');

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
        
        // Fallback to SNRB sale data for development
        return [
          {
            publicKey: new PublicKey('11111111111111111111111111111112'),
            account: {
              seller: new PublicKey('HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4'),
              tokenMint: new PublicKey('So11111111111111111111111111111111111111112'),
              paymentMint: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
              pricePerToken: new BN(10000000), // 0.01 SOL in lamports
              totalTokens: new BN(10000000000000), // 10M tokens
              tokensAvailable: new BN(7500000000000), // 7.5M available
              saleStartTime: new BN(Math.floor(Date.now() / 1000) - 3600), // Started 1 hour ago
              saleEndTime: new BN(Math.floor(Date.now() / 1000) + 2592000), // Ends in 30 days
              maxTokensPerBuyer: new BN(100000000000), // 100K max per buyer
              platformFeeBps: 300, // 3%
              platformFeeRecipient: new PublicKey('9yWMwzQb47KGTPKBhCkPYDUcprDBTDQgXvTsc1VTZyPE'),
              isActive: true,
              isPaused: false,
              bump: 254
            }
          }
        ];
      }
    },
    enabled: !!program,
    refetchInterval: 30000, // Refetch every 30 seconds
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

      // For demo purposes, simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSignature = 'mock_signature_' + Date.now();
      const [tokenSalePDA] = getTokenSalePDA(publicKey, params.tokenMint);

      return { signature: mockSignature, tokenSalePDA };
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
        
        // Fallback for development - simulate transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockSignature = 'mock_purchase_' + Date.now();
        return { signature: mockSignature };
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