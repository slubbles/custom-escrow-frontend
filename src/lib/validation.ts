import { PublicKey } from '@solana/web3.js';
import { z } from 'zod';

/**
 * Solana address validation
 */
export const validateSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

/**
 * Token amount validation with decimals
 */
export const validateTokenAmount = (amount: string, decimals: number = 9): {
  isValid: boolean;
  error?: string;
  parsedAmount?: number;
} => {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Amount must be a positive number' };
  }

  if (numAmount > 1e12) {
    return { isValid: false, error: 'Amount is too large' };
  }

  // Check decimal places
  const decimalPlaces = (amount.split('.')[1] || '').length;
  if (decimalPlaces > decimals) {
    return { isValid: false, error: `Maximum ${decimals} decimal places allowed` };
  }

  return { isValid: true, parsedAmount: numAmount };
};

/**
 * Price validation
 */
export const validatePrice = (price: string): {
  isValid: boolean;
  error?: string;
  parsedPrice?: number;
} => {
  if (!price || price.trim() === '') {
    return { isValid: false, error: 'Price is required' };
  }

  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice) || numPrice <= 0) {
    return { isValid: false, error: 'Price must be a positive number' };
  }

  if (numPrice < 0.000001) {
    return { isValid: false, error: 'Price is too small (minimum 0.000001)' };
  }

  if (numPrice > 1000000) {
    return { isValid: false, error: 'Price is too large (maximum 1,000,000)' };
  }

  return { isValid: true, parsedPrice: numPrice };
};

/**
 * Date validation for sale periods
 */
export const validateSaleDates = (startDate: Date, endDate: Date): {
  isValid: boolean;
  error?: string;
} => {
  const now = new Date();
  
  if (startDate <= now) {
    return { isValid: false, error: 'Start date must be in the future' };
  }

  if (endDate <= startDate) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  const duration = endDate.getTime() - startDate.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneYear = 365 * oneDay;

  if (duration < oneDay) {
    return { isValid: false, error: 'Sale must last at least 1 day' };
  }

  if (duration > oneYear) {
    return { isValid: false, error: 'Sale cannot last more than 1 year' };
  }

  return { isValid: true };
};

/**
 * Project categories enum for validation
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
 * Enhanced project creation schema with better validation
 */
export const projectCreationSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(50, 'Project name must be under 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Project name can only contain letters, numbers, spaces, hyphens, and underscores'),
    
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be under 500 characters'),

  category: z.nativeEnum(ProjectCategory, { 
    errorMap: () => ({ message: 'Please select a category' }) 
  }),
    
  tokenMint: z.string()
    .refine(validateSolanaAddress, 'Invalid Solana address format'),
    
  targetAmount: z.number()
    .min(0.1, 'Target amount must be at least 0.1 SOL')
    .max(1000000, 'Target amount cannot exceed 1,000,000 SOL'),
    
  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
    
  twitter: z.string()
    .url('Invalid Twitter URL')
    .refine((url) => !url || url.includes('twitter.com') || url.includes('x.com'), 'Must be a Twitter/X URL')
    .optional()
    .or(z.literal('')),
    
  discord: z.string()
    .url('Invalid Discord URL')
    .refine((url) => !url || url.includes('discord'), 'Must be a Discord URL')
    .optional()
    .or(z.literal('')),
    
  telegram: z.string()
    .url('Invalid Telegram URL')
    .refine((url) => !url || url.includes('t.me'), 'Must be a Telegram URL')
    .optional()
    .or(z.literal('')),
});

/**
 * Token purchase validation
 */
export const validateTokenPurchase = (
  amount: string,
  maxAmount: number,
  userBalance: number,
  tokenPrice: number
): {
  isValid: boolean;
  error?: string;
  totalCost?: number;
} => {
  const amountValidation = validateTokenAmount(amount);
  if (!amountValidation.isValid) {
    return amountValidation;
  }

  const tokenAmount = amountValidation.parsedAmount!;
  
  if (tokenAmount > maxAmount) {
    return { isValid: false, error: `Maximum purchase amount is ${maxAmount.toLocaleString()} tokens` };
  }

  const totalCost = tokenAmount * tokenPrice;
  
  if (totalCost > userBalance) {
    return { isValid: false, error: `Insufficient balance. Need ${totalCost.toFixed(4)} SOL, have ${userBalance.toFixed(4)} SOL` };
  }

  return { isValid: true, totalCost };
};

/**
 * Format numbers for display
 */
export const formatTokenAmount = (amount: number, decimals: number = 2): string => {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(decimals)}B`;
  }
  if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(decimals)}M`;
  }
  if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(decimals)}K`;
  }
  return amount.toFixed(decimals);
};

/**
 * Format SOL amounts
 */
export const formatSolAmount = (lamports: number): string => {
  const sol = lamports / 1e9;
  if (sol >= 1000) {
    return `${(sol / 1000).toFixed(2)}K SOL`;
  }
  if (sol >= 1) {
    return `${sol.toFixed(3)} SOL`;
  }
  return `${sol.toFixed(6)} SOL`;
};

/**
 * Calculate time remaining
 */
export const getTimeRemaining = (endTime: number): {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
} => {
  const now = Date.now() / 1000;
  const remaining = endTime - now;
  
  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }
  
  const days = Math.floor(remaining / (24 * 60 * 60));
  const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remaining % (60 * 60)) / 60);
  
  return { days, hours, minutes, isExpired: false };
};