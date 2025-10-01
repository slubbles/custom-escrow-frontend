'use client';

import { QueryClient } from '@tanstack/react-query';

// Optimized Query Client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry configuration
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus only if data is stale
      refetchOnWindowFocus: 'always',
      // Refetch on reconnect
      refetchOnReconnect: 'always',
      // Refetch on mount only if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Prefetch commonly used data
export async function prefetchCommonData() {
  // Prefetch platform info
  await queryClient.prefetchQuery({
    queryKey: ['platform'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Prefetch projects
  await queryClient.prefetchQuery({
    queryKey: ['projects'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Cache keys for consistency
export const CACHE_KEYS = {
  platform: ['platform'],
  projects: ['projects'],
  project: (id: string) => ['project', id],
  saleRounds: (projectId: number) => ['saleRounds', projectId],
  saleRound: (projectId: number, roundNumber: number) => ['saleRound', projectId, roundNumber],
  portfolio: (wallet: string) => ['portfolio', wallet],
  buyer: (wallet: string, projectId: number, roundNumber: number) => 
    ['buyer', wallet, projectId, roundNumber],
} as const;

// Invalidate related caches
export function invalidateProjectCaches(projectId?: string) {
  if (projectId) {
    queryClient.invalidateQueries({ queryKey: CACHE_KEYS.project(projectId) });
  }
  queryClient.invalidateQueries({ queryKey: CACHE_KEYS.projects });
}

export function invalidateSaleCaches(projectId: number, roundNumber?: number) {
  if (roundNumber !== undefined) {
    queryClient.invalidateQueries({ 
      queryKey: CACHE_KEYS.saleRound(projectId, roundNumber) 
    });
  }
  queryClient.invalidateQueries({ queryKey: CACHE_KEYS.saleRounds(projectId) });
  queryClient.invalidateQueries({ queryKey: CACHE_KEYS.projects });
}

export function invalidatePortfolio(wallet: string) {
  queryClient.invalidateQueries({ queryKey: CACHE_KEYS.portfolio(wallet) });
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy load image utility
export function lazyLoadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}
