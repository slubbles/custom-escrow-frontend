import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

/**
 * Platform information structure (Multi-Presale)
 */
export interface PlatformAccount {
  authority: PublicKey;
  treasury: PublicKey;
  platformFee: number; // in basis points
  totalProjects: number;
  isPaused: boolean;
  minProjectDuration: number;
  maxProjectDuration: number;
  bump: number;
}

/**
 * Project category types
 */
export enum ProjectCategory {
  DEFI = 'DeFi',
  GAMING = 'Gaming',
  AI = 'AI',
  NFT = 'NFT',
  INFRASTRUCTURE = 'Infrastructure',
  OTHER = 'Other'
}

/**
 * Project status types
 */
export enum ProjectStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Sale type enumeration
 */
export enum SaleType {
  SEED = 'seed',
  PRIVATE = 'private',
  PUBLIC = 'public'
}

/**
 * Multi-Presale Project Account Structure
 */
export interface MultiPresaleProject {
  id: number;
  creator: PublicKey;
  name: string;
  description: string;
  category: ProjectCategory;
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  tokenMint: PublicKey;
  status: ProjectStatus;
  createdAt: BN;
  totalRaised: BN;
  targetAmount: BN;
  currentRound: number;
  totalRounds: number;
  bump: number;
}

/**
 * Sale Round Structure
 */
export interface SaleRound {
  projectId: number;
  saleType: SaleType;
  roundNumber: number;
  tokenPrice: BN; // Price per token in payment mint units
  totalTokens: BN;
  tokensSold: BN;
  startTime: BN;
  endTime: BN;
  maxTokensPerBuyer: BN;
  whitelistRequired: boolean;
  isActive: boolean;
  bump: number;
}

/**
 * Round Buyer Account Structure
 */
export interface RoundBuyerAccount {
  buyer: PublicKey;
  projectId: number;
  roundNumber: number;
  tokensPurchased: BN;
  amountPaid: BN;
  purchaseTime: BN;
  bump: number;
}

/**
 * Project Vault Structure
 */
export interface ProjectVault {
  projectId: number;
  totalDeposited: BN;
  totalWithdrawn: BN;
  bump: number;
}

/**
 * Platform Treasury Structure
 */
export interface PlatformTreasury {
  totalFees: BN;
  totalWithdrawn: BN;
  bump: number;
}

/**
 * Project Whitelist Structure
 */
export interface ProjectWhitelist {
  projectId: number;
  roundNumber: number;
  whitelistedAddresses: PublicKey[];
  bump: number;
}

/**
 * Raw account data structures as returned by Anchor
 */
export interface MultiPresaleProjectAccount {
  publicKey: PublicKey;
  account: MultiPresaleProject;
}

export interface SaleRoundAccount {
  publicKey: PublicKey;
  account: SaleRound;
}

export interface RoundBuyerAccountAccount {
  publicKey: PublicKey;
  account: RoundBuyerAccount;
}

/**
 * Legacy types for backward compatibility
 */
export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  tokenMint: PublicKey;
  tokenSymbol: string;
  tokenName: string;
  creator: PublicKey;
  isVerified: boolean;
  createdAt: number;
}

/**
 * Sale tier types
 */
export enum SaleTier {
  SEED = 'seed',
  PRIVATE = 'private',
  PUBLIC = 'public'
}

/**
 * Vesting schedule structure
 */
export interface VestingSchedule {
  totalTokens: BN;
  releasedTokens: BN;
  startTime: BN;
  cliffDuration: BN; // in seconds
  vestingDuration: BN; // in seconds
  isLinear: boolean;
}

/**
 * TokenSale account structure matching the smart contract
 */
export interface TokenSale {
  project: PublicKey; // Reference to project account
  seller: PublicKey;
  tokenMint: PublicKey;
  paymentMint: PublicKey;
  tier: SaleTier;
  pricePerToken: BN;
  totalTokens: BN;
  tokensAvailable: BN;
  saleStartTime: BN;
  saleEndTime: BN;
  maxTokensPerBuyer: BN;
  vestingDuration: BN; // Duration of vesting in seconds
  cliffDuration: BN; // Cliff period in seconds
  platformFeeBps: number;
  platformFeeRecipient: PublicKey;
  isActive: boolean;
  isPaused: boolean;
  bump: number;
}

/**
 * BuyerAccount structure with vesting and referral tracking
 */
export interface BuyerAccount {
  buyer: PublicKey;
  project: PublicKey;
  tokenSale: PublicKey;
  tokensPurchased: BN;
  vestingSchedule: VestingSchedule;
  referrer?: PublicKey; // Who referred this buyer
  referralBonus: BN; // Bonus tokens from referrals
  claimedTokens: BN; // Tokens already claimed
  bump: number;
}

/**
 * Referral tracking structure
 */
export interface ReferralAccount {
  referrer: PublicKey;
  project: PublicKey;
  totalReferrals: number;
  totalBonusEarned: BN;
  tier: number; // Referral tier based on performance
  bump: number;
}

/**
 * Project account structure
 */
export interface ProjectAccount {
  creator: PublicKey;
  slug: string;
  name: string;
  description: string;
  tokenMint: PublicKey;
  isVerified: boolean;
  totalRaised: BN;
  totalParticipants: number;
  activeSales: PublicKey[]; // Array of active sale PDAs
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

export interface ProjectAccountAccount {
  publicKey: PublicKey;
  account: ProjectAccount;
}

export interface ReferralAccountAccount {
  publicKey: PublicKey;
  account: ReferralAccount;
}

/**
 * Multi-Presale Parameter Types
 */

/**
 * Create project parameters (Multi-Presale)
 */
export interface CreateMultiPresaleProjectParams {
  name: string;
  description: string;
  category: ProjectCategory;
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  tokenMint: string;
  targetAmount: number;
}

/**
 * Create sale round parameters
 */
export interface CreateSaleRoundParams {
  projectId: number;
  saleType: SaleType;
  roundNumber: number;
  tokenPrice: number;
  totalTokens: number;
  startTime: number;
  endTime: number;
  maxTokensPerBuyer: number;
  whitelistRequired: boolean;
}

/**
 * Buy tokens parameters (Multi-Presale)
 */
export interface BuyTokensMultiPresaleParams {
  projectId: number;
  roundNumber: number;
  tokenAmount: BN;
  maxPrice: BN; // Slippage protection
}

/**
 * Add to whitelist parameters
 */
export interface AddToWhitelistParams {
  projectId: number;
  roundNumber: number;
  addresses: PublicKey[];
}

/**
 * Update project parameters
 */
export interface UpdateProjectParams {
  projectId: number;
  name?: string;
  description?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
}

/**
 * Legacy Parameter Types (for backward compatibility)
 */
export interface CreateProjectParams {
  slug: string;
  name: string;
  description: string;
  tokenMint: string;
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
}

/**
 * Initialize sale parameters for tiered sales
 */
export interface InitializeSaleParams {
  projectId: string;
  tier: SaleTier;
  pricePerToken: number;
  totalTokens: number;
  saleStartTime: number;
  saleEndTime: number;
  maxTokensPerBuyer: number;
  vestingDurationMonths: number;
  cliffDurationMonths: number;
  paymentMint: string;
  platformFeeBps: number;
  platformFeeRecipient: string;
}

/**
 * Buy tokens parameters with referral support
 */
export interface BuyTokensParams {
  tokenAmount: BN;
  referrer?: PublicKey;
}

/**
 * Create referral parameters
 */
export interface CreateReferralParams {
  projectId: string;
  referralCode: string;
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
  PROJECT: 'project',
  REFERRAL: 'referral',
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
  ProjectNotFound = 'ProjectNotFound',
  InvalidReferrer = 'InvalidReferrer',
}

/**
 * Transaction result with signature and optional data
 */
export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
  message?: string;
  data?: any; // Optional data returned from the transaction
}