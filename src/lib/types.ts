import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

/**
 * TokenSale account structure matching the smart contract
 */
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

/**
 * BuyerAccount structure matching the smart contract
 */
export interface BuyerAccount {
  buyer: PublicKey;
  tokenSale: PublicKey;
  tokensPurchased: BN;
  bump: number;
}

/**
 * Raw account data structure as returned by Anchor
 */
export interface TokenSaleAccount {
  publicKey: PublicKey;
  account: TokenSale;
}

export interface BuyerAccountAccount {
  publicKey: PublicKey;
  account: BuyerAccount;
}

/**
 * Initialize sale parameters
 */
export interface InitializeSaleParams {
  pricePerToken: BN;
  totalTokens: BN;
  saleStartTime: BN;
  saleEndTime: BN;
  maxTokensPerBuyer: BN;
  platformFeeBps: number;
  platformFeeRecipient: PublicKey;
}

/**
 * Buy tokens parameters
 */
export interface BuyTokensParams {
  tokenAmount: BN;
}

/**
 * Update sale parameters
 */
export interface UpdateSaleParams {
  newPricePerToken?: BN;
  newSaleEndTime?: BN;
  newMaxTokensPerBuyer?: BN;
}

/**
 * PDA seed constants
 */
export const PDA_SEEDS = {
  TOKEN_SALE: 'token_sale',
  TOKEN_VAULT: 'token_vault',
  BUYER: 'buyer',
} as const;

/**
 * Program error types
 */
export enum EscrowError {
  SaleNotActive = 'SaleNotActive',
  SaleNotStarted = 'SaleNotStarted', 
  SaleEnded = 'SaleEnded',
  SalePaused = 'SalePaused',
  InsufficientTokens = 'InsufficientTokens',
  ExceedsMaxPurchase = 'ExceedsMaxPurchase',
  Unauthorized = 'Unauthorized',
}

/**
 * Transaction result with signature
 */
export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
  message?: string;
}