'use client';

import { toast } from 'react-hot-toast';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  WALLET = 'WALLET',
  TRANSACTION = 'TRANSACTION',
  VALIDATION = 'VALIDATION',
  PROGRAM = 'PROGRAM',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string;
  originalError?: any;
}

// Error messages
const ERROR_MESSAGES: Record<string, string> = {
  // Wallet errors
  'User rejected': 'Transaction was cancelled by user',
  'User rejected the request': 'Transaction was cancelled by user',
  'WalletNotConnectedError': 'Please connect your wallet first',
  'WalletSignTransactionError': 'Failed to sign transaction. Please try again',
  
  // Network errors
  'Failed to fetch': 'Network connection error. Please check your internet',
  'NetworkError': 'Unable to connect to Solana network',
  'Timeout': 'Request timed out. Please try again',
  
  // Transaction errors
  'Transaction simulation failed': 'Transaction would fail. Please check your inputs',
  'Insufficient funds': 'Insufficient SOL balance for transaction',
  'custom program error': 'Smart contract error occurred',
  'InsufficientFundsForRent': 'Insufficient funds to cover rent',
  
  // Program errors
  'Account does not exist': 'Required account not found',
  'Invalid account data': 'Invalid account data structure',
  'Program failed to complete': 'Smart contract execution failed',
};

// Parse error and return user-friendly message
export function parseError(error: any): AppError {
  console.error('Error caught:', error);

  // Handle wallet errors
  if (error?.message?.includes('User rejected') || error?.message?.includes('cancelled')) {
    return {
      type: ErrorType.WALLET,
      message: 'Transaction cancelled',
      details: 'You cancelled the transaction in your wallet',
      originalError: error,
    };
  }

  if (error?.name === 'WalletNotConnectedError' || error?.message?.includes('wallet')) {
    return {
      type: ErrorType.WALLET,
      message: 'Wallet not connected',
      details: 'Please connect your wallet to continue',
      originalError: error,
    };
  }

  // Handle network errors
  if (error?.message?.includes('fetch') || error?.message?.includes('Network')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network error',
      details: 'Unable to connect to the network. Please check your connection',
      originalError: error,
    };
  }

  // Handle transaction errors
  if (error?.message?.includes('Transaction') || error?.message?.includes('simulation')) {
    return {
      type: ErrorType.TRANSACTION,
      message: 'Transaction failed',
      details: extractTransactionError(error.message),
      originalError: error,
    };
  }

  // Handle program errors
  if (error?.message?.includes('Program') || error?.message?.includes('custom program error')) {
    return {
      type: ErrorType.PROGRAM,
      message: 'Smart contract error',
      details: extractProgramError(error.message),
      code: extractErrorCode(error.message),
      originalError: error,
    };
  }

  // Handle validation errors
  if (error?.issues || error?.name === 'ZodError') {
    return {
      type: ErrorType.VALIDATION,
      message: 'Validation error',
      details: error.issues?.[0]?.message || 'Please check your inputs',
      originalError: error,
    };
  }

  // Unknown error
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    details: error?.message || 'Please try again or contact support',
    originalError: error,
  };
}

// Extract meaningful transaction error
function extractTransactionError(message: string): string {
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (message.includes(key)) {
      return value;
    }
  }
  
  if (message.includes('0x')) {
    return 'Transaction failed with error code. Please try again';
  }
  
  return message.slice(0, 100);
}

// Extract program error details
function extractProgramError(message: string): string {
  // Extract custom program error if present
  const customErrorMatch = message.match(/custom program error: (0x[0-9a-fA-F]+)/);
  if (customErrorMatch) {
    const errorCode = customErrorMatch[1];
    return `Smart contract error (${errorCode}). Please contact support`;
  }
  
  return 'An error occurred in the smart contract';
}

// Extract error code
function extractErrorCode(message: string): string | undefined {
  const match = message.match(/0x[0-9a-fA-F]+/);
  return match?.[0];
}

// Display error as toast
export function showError(error: any) {
  const appError = parseError(error);
  
  toast.error(appError.message, {
    duration: 5000,
    style: {
      background: '#FEE2E2',
      color: '#991B1B',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: 500,
    },
    icon: '⚠️',
  });

  // Log details to console for debugging
  if (appError.details) {
    console.warn('Error details:', appError.details);
  }
  if (appError.code) {
    console.warn('Error code:', appError.code);
  }
}

// Display success message
export function showSuccess(message: string, details?: string) {
  toast.success(message, {
    duration: 4000,
    style: {
      background: '#D1FAE5',
      color: '#065F46',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: 500,
    },
    icon: '✅',
  });

  if (details) {
    console.log('Success details:', details);
  }
}

// Display info message
export function showInfo(message: string) {
  toast(message, {
    duration: 3000,
    style: {
      background: '#DBEAFE',
      color: '#1E40AF',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: 500,
    },
    icon: 'ℹ️',
  });
}

// Display warning message
export function showWarning(message: string) {
  toast(message, {
    duration: 4000,
    style: {
      background: '#FEF3C7',
      color: '#92400E',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: 500,
    },
    icon: '⚠️',
  });
}

// Loading toast
export function showLoading(message: string = 'Processing...') {
  return toast.loading(message, {
    style: {
      background: '#F3F4F6',
      color: '#374151',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: 500,
    },
  });
}

// Dismiss toast
export function dismissToast(id: string) {
  toast.dismiss(id);
}

// Handle async operation with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | null> {
  const loadingId = showLoading();
  
  try {
    const result = await operation();
    dismissToast(loadingId);
    
    if (successMessage) {
      showSuccess(successMessage);
    }
    
    return result;
  } catch (error) {
    dismissToast(loadingId);
    
    if (errorMessage) {
      showError(new Error(errorMessage));
    } else {
      showError(error);
    }
    
    return null;
  }
}
