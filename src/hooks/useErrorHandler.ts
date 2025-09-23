'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorCode?: string;
  retryCount: number;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  maxRetries?: number;
  onError?: (error: Error) => void;
  onRetry?: () => void;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const {
    showToast = true,
    logError = true,
    maxRetries = 3,
    onError,
    onRetry,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    retryCount: 0,
  });

  const handleError = useCallback((error: Error, errorCode?: string) => {
    if (logError) {
      console.error('Error handled by useErrorHandler:', error);
    }

    if (showToast) {
      const errorMessage = getErrorMessage(error, errorCode);
      toast.error(errorMessage);
    }

    setErrorState(prev => ({
      hasError: true,
      error,
      errorCode,
      retryCount: prev.retryCount,
    }));

    onError?.(error);
  }, [logError, showToast, onError]);

  const retry = useCallback(() => {
    if (errorState.retryCount < maxRetries) {
      setErrorState(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
      }));
      onRetry?.();
    } else {
      toast.error('Maximum retry attempts reached');
    }
  }, [errorState.retryCount, maxRetries, onRetry]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  const canRetry = errorState.retryCount < maxRetries;

  return {
    errorState,
    handleError,
    retry,
    clearError,
    canRetry,
  };
}

// Helper function to get user-friendly error messages
export function getErrorMessage(error: Error, errorCode?: string): string {
  // Solana/Anchor specific errors
  if (error.message.includes('User rejected the request')) {
    return 'Transaction was cancelled by user';
  }

  if (error.message.includes('Insufficient funds')) {
    return 'Insufficient SOL balance for transaction';
  }

  if (error.message.includes('blockhash not found')) {
    return 'Network congestion detected. Please try again';
  }

  if (error.message.includes('Wallet not connected')) {
    return 'Please connect your wallet to continue';
  }

  if (error.message.includes('Program not found')) {
    return 'Smart contract not found. Please check network settings';
  }

  if (error.message.includes('Transaction simulation failed')) {
    return 'Transaction would fail. Please check your inputs';
  }

  // Network errors
  if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
    return 'Network error. Please check your connection';
  }

  // Validation errors
  if (error.message.includes('Invalid')) {
    return 'Invalid input provided. Please check your data';
  }

  // Permission errors
  if (error.message.includes('Permission denied') || error.message.includes('Unauthorized')) {
    return 'You do not have permission to perform this action';
  }

  // Rate limiting
  if (error.message.includes('Too many requests')) {
    return 'Too many requests. Please wait and try again';
  }

  // Timeout errors
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again';
  }

  // Smart contract specific errors
  if (errorCode) {
    switch (errorCode) {
      case 'PROJECT_NOT_FOUND':
        return 'Project not found';
      case 'SALE_NOT_ACTIVE':
        return 'Sale is not currently active';
      case 'INSUFFICIENT_ALLOCATION':
        return 'Not enough tokens available for purchase';
      case 'NOT_WHITELISTED':
        return 'Address not whitelisted for this sale';
      case 'PURCHASE_LIMIT_EXCEEDED':
        return 'Purchase limit exceeded for this round';
      case 'SALE_ENDED':
        return 'Sale has already ended';
      case 'SALE_NOT_STARTED':
        return 'Sale has not started yet';
      case 'ADMIN_ONLY':
        return 'Admin access required';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }

  // Default fallback
  return error.message || 'An unexpected error occurred. Please try again';
}

// Transaction error handling specifically for Solana
export function useSolanaErrorHandler() {
  return useErrorHandler({
    showToast: true,
    logError: true,
    maxRetries: 2,
    onError: (error) => {
      // Log specific Solana errors for debugging
      if (error.message.includes('0x')) {
        console.error('Solana transaction error code:', error.message);
      }
    },
  });
}

// API error handling for backend calls
export function useApiErrorHandler() {
  return useErrorHandler({
    showToast: true,
    logError: true,
    maxRetries: 3,
    onError: (error) => {
      // Log API errors with more context
      console.error('API Error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    },
  });
}

// Validation error handling
export function useValidationErrorHandler() {
  return useErrorHandler({
    showToast: true,
    logError: false, // Validation errors are expected, no need to log
    maxRetries: 0, // No retries for validation errors
  });
}

// Network error handling with automatic retries
export function useNetworkErrorHandler() {
  return useErrorHandler({
    showToast: true,
    logError: true,
    maxRetries: 5,
    onRetry: () => {
      toast.loading('Retrying connection...', { duration: 1000 });
    },
  });
}

// Generic async operation wrapper with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorHandler: ReturnType<typeof useErrorHandler>
): Promise<T | null> {
  try {
    const result = await operation();
    errorHandler.clearError();
    return result;
  } catch (error) {
    errorHandler.handleError(error as Error);
    return null;
  }
}