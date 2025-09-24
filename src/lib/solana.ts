import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, setProvider, Idl } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { MULTI_PRESALE_PROGRAM_ID, ESCROW_PROGRAM_ID, PLATFORM_FEE_RECIPIENT } from './pdas';
import escrowIdl from './escrow-idl.json';
import multiPresaleIdl from './multi-presale-idl.json';

// Environment variables
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com';

// Connection instance with optimal settings
export const connection = new Connection(RPC_URL, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
});

// Export IDLs for use in program initialization
export const ESCROW_IDL = escrowIdl as Idl;
export const MULTI_PRESALE_IDL = multiPresaleIdl as Idl;

// Re-export important constants
export { MULTI_PRESALE_PROGRAM_ID, ESCROW_PROGRAM_ID, PLATFORM_FEE_RECIPIENT };

// Token Sale Account Structure
export interface TokenSale {
  seller: PublicKey;
  tokenMint: PublicKey;
  paymentMint: PublicKey;
  pricePerToken: number;
  totalTokens: number;
  tokensAvailable: number;
  saleStartTime: number;
  saleEndTime: number;
  maxTokensPerBuyer: number;
  platformFeeBps: number;
  platformFeeRecipient: PublicKey;
  isActive: boolean;
  isPaused: boolean;
  bump: number;
}

// Buyer Account Structure
export interface BuyerAccount {
  buyer: PublicKey;
  tokenSale: PublicKey;
  tokensPurchased: number;
  bump: number;
}

// PDA Derivation Functions (Legacy - for backward compatibility)
export const getTokenSalePDA = (seller: PublicKey, tokenMint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('token_sale'),
      seller.toBuffer(),
      tokenMint.toBuffer()
    ],
    ESCROW_PROGRAM_ID
  );
};

export const getTokenVaultPDA = (tokenSalePDA: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('token_vault'),
      tokenSalePDA.toBuffer()
    ],
    ESCROW_PROGRAM_ID
  );
};

export const getBuyerAccountPDA = (buyer: PublicKey, tokenSalePDA: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('buyer'),
      buyer.toBuffer(),
      tokenSalePDA.toBuffer()
    ],
    ESCROW_PROGRAM_ID
  );
};

// Utility function for associated token addresses
export const getAssociatedTokenAddress = async (mint: PublicKey, owner: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      owner.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];
};

// Utility Functions
export const calculatePurchaseCost = (
  tokenAmount: number,
  pricePerToken: number,
  platformFeeBps: number
) => {
  const grossPayment = tokenAmount * pricePerToken;
  const platformFee = Math.floor(grossPayment * platformFeeBps / 10000);
  const sellerPayment = grossPayment - platformFee;
  
  return {
    grossPayment,
    platformFee,
    sellerPayment,
    total: grossPayment
  };
};

// Get current timestamp
export const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

// Format timestamp to date
export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Validate sale timing
export const validateSaleTiming = (startTime: number, endTime: number) => {
  const now = getCurrentTimestamp();
  return {
    isValidStart: startTime > now,
    isValidEnd: endTime > startTime,
    isActive: now >= startTime && now <= endTime,
    isEnded: now > endTime,
    isUpcoming: now < startTime
  };
};

// Common token mints (Devnet)
export const COMMON_TOKENS = {
  USDC: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), // Devnet USDC
  SOL: new PublicKey('So11111111111111111111111111111111111111112'), // Wrapped SOL
};

// Error handling
export class EscrowError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'EscrowError';
  }
}

// Network helpers
export const getExplorerUrl = (signature: string, network = SOLANA_NETWORK) => {
  const baseUrl = network === 'mainnet' ? 'https://explorer.solana.com' : 'https://explorer.solana.com';
  const cluster = network === 'mainnet' ? '' : `?cluster=${network}`;
  return `${baseUrl}/tx/${signature}${cluster}`;
};

export const getAccountExplorerUrl = (address: string, network = SOLANA_NETWORK) => {
  const baseUrl = network === 'mainnet' ? 'https://explorer.solana.com' : 'https://explorer.solana.com';
  const cluster = network === 'mainnet' ? '' : `?cluster=${network}`;
  return `${baseUrl}/address/${address}${cluster}`;
};