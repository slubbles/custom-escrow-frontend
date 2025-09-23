'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-landscape flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-mountain-900 mb-4">
          Something went wrong
        </h1>
        
        <p className="text-mountain-600 mb-6">
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
          <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
          <p className="text-xs text-red-700 font-mono break-all">
            {error.message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={retry}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 bg-mountain-600 hover:bg-mountain-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-mountain-500 hover:text-mountain-700">
              Developer Details
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Specific error components for different scenarios
export function WalletConnectionError({ retry }: { retry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-landscape flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-mountain-900 mb-4">
          Wallet Connection Error
        </h1>
        
        <p className="text-mountain-600 mb-6">
          Unable to connect to your Solana wallet. Please check your wallet extension and try again.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={retry}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry Connection
          </button>
          
          <Link
            href="/"
            className="bg-mountain-600 hover:bg-mountain-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Continue Without Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NetworkError({ retry }: { retry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-landscape flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-mountain-900 mb-4">
          Network Error
        </h1>
        
        <p className="text-mountain-600 mb-6">
          Unable to connect to the Solana network. Please check your internet connection and try again.
        </p>

        <button
          onClick={retry}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2 inline" />
          Retry Connection
        </button>
      </div>
    </div>
  );
}