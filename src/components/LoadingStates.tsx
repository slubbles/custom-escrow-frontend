'use client';

import React from 'react';
import { Loader2, Wallet, TrendingUp, Users, DollarSign, Target, BarChart3 } from 'lucide-react';

// Generic loading spinner
export function LoadingSpinner({ size = 'md', className = '' }: { 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} aria-label="Loading" />
  );
}

// Full page loading with enhanced animation
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-sky-200 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-r-golden-400 mx-auto" style={{animationDelay: '0.3s', animationDuration: '1.5s'}}></div>
          <div className="h-20 w-20 mx-auto flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-pulse" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-8 text-mountain-700 text-lg font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// Card skeleton loader with shimmer effect
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-cream-200/50 p-6 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 skeleton w-3/4 mb-2"></div>
          <div className="h-4 skeleton w-1/2 mb-3"></div>
          <div className="h-4 skeleton w-full mb-2"></div>
          <div className="h-4 skeleton w-2/3"></div>
        </div>
        <div className="w-4 h-4 skeleton rounded"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-mountain-50 rounded-lg p-3">
          <div className="h-3 skeleton w-1/2 mb-2"></div>
          <div className="h-5 skeleton w-3/4"></div>
        </div>
        <div className="bg-mountain-50 rounded-lg p-3">
          <div className="h-3 skeleton w-1/2 mb-2"></div>
          <div className="h-5 skeleton w-3/4"></div>
        </div>
      </div>

      <div className="bg-mountain-50 rounded-lg p-3 mb-4">
        <div className="h-3 skeleton w-1/3 mb-2"></div>
        <div className="w-full h-2 skeleton rounded-full mb-2"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 skeleton"></div>
          <div className="h-3 skeleton"></div>
          <div className="h-3 skeleton"></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="h-4 skeleton w-1/4"></div>
        <div className="h-8 skeleton w-20 rounded-lg"></div>
      </div>
    </div>
  );
}

// Table loading skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-100 last:border-b-0">
          <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats grid loading
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(count, 4)} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-7 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Project card loading
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-cream-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
        
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3"></div>
        
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

// Loading state for specific components
export function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-gradient-landscape">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 bg-white/20 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-landscape">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 bg-white/20 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 animate-pulse"></div>
          </div>

          <StatsGridSkeleton count={4} />

          <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            <TableSkeleton rows={8} cols={6} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Button loading states
export function ButtonLoading({ children, isLoading, ...props }: {
  children: React.ReactNode;
  isLoading: boolean;
  [key: string]: any;
}) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${props.className} ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Inline loading for smaller components
export function InlineLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size="sm" className="text-mountain-500 mr-2" />
      <span className="text-mountain-600 text-sm">{message}</span>
    </div>
  );
}

// Empty state component
export function EmptyState({ 
  icon: Icon = Target,
  title,
  description,
  action
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-mountain-900 mb-2">{title}</h3>
      <p className="text-mountain-600 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}