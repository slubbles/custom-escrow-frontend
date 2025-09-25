'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTransactionStatus } from '@/hooks/useAdminOperations';

interface TransactionMonitorProps {
  signature: string;
  onComplete?: (success: boolean) => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function TransactionMonitor({ 
  signature, 
  onComplete, 
  autoClose = true, 
  autoCloseDelay = 5000 
}: TransactionMonitorProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [details, setDetails] = useState<{
    blockTime?: number;
    slot?: number;
    error?: string;
  }>({});
  const [attempts, setAttempts] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const { checkTransaction } = useTransactionStatus();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    
    const maxAttempts = 30; // Try for up to 30 seconds
    const checkInterval = 1000; // Check every second

    const pollTransaction = async () => {
      if (attempts >= maxAttempts) {
        setStatus('error');
        setDetails(prev => ({ ...prev, error: 'Transaction confirmation timeout' }));
        onComplete?.(false);
        return;
      }

      try {
        const result = await checkTransaction(signature);
        setAttempts(prev => prev + 1);

        if (result.confirmed) {
          if (result.success) {
            setStatus('success');
            setDetails({
              blockTime: result.blockTime,
              slot: result.slot
            });
            onComplete?.(true);
            
            if (autoClose) {
              timeoutId = setTimeout(() => {
                setIsVisible(false);
              }, autoCloseDelay);
            }
          } else {
            setStatus('error');
            setDetails({ error: result.error || 'Transaction failed' });
            onComplete?.(false);
          }
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error checking transaction:', error);
        setAttempts(prev => prev + 1);
      }
    };

    // Start polling
    pollTransaction();
    intervalId = setInterval(pollTransaction, checkInterval);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [signature, checkTransaction, onComplete, autoClose, autoCloseDelay, attempts]);

  if (!isVisible) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <ArrowPathIcon className="w-5 h-5 text-golden-600 animate-spin" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-forest-600" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-golden-200 bg-golden-50';
      case 'success':
        return 'border-forest-200 bg-forest-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return `Confirming transaction... (${attempts}/${30})`;
      case 'success':
        return 'Transaction confirmed successfully!';
      case 'error':
        return details.error || 'Transaction failed';
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full bg-white border-2 rounded-lg shadow-lg p-4 z-50 ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-mountain-800 mb-1">
            {getStatusText()}
          </div>
          <div className="text-xs text-mountain-600 font-mono break-all">
            {signature.slice(0, 16)}...{signature.slice(-16)}
          </div>
          {status === 'success' && details.blockTime && (
            <div className="text-xs text-mountain-500 mt-1">
              Block time: {new Date(details.blockTime * 1000).toLocaleString()}
            </div>
          )}
          {status === 'success' && details.slot && (
            <div className="text-xs text-mountain-500">
              Slot: {details.slot.toLocaleString()}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-mountain-400 hover:text-mountain-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {status === 'pending' && (
        <div className="mt-3">
          <div className="w-full bg-mountain-200 rounded-full h-1">
            <div 
              className="bg-golden-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((attempts / 30) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Transaction Monitor Hook for easier usage
export function useTransactionMonitor() {
  const [monitors, setMonitors] = useState<Array<{
    id: string;
    signature: string;
    onComplete?: (success: boolean) => void;
  }>>([]);

  const addTransaction = (signature: string, onComplete?: (success: boolean) => void) => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setMonitors(prev => [...prev, { id, signature, onComplete }]);
    return id;
  };

  const removeTransaction = (id: string) => {
    setMonitors(prev => prev.filter(monitor => monitor.id !== id));
  };

  const TransactionMonitors = () => (
    <>
      {monitors.map((monitor, index) => (
        <div key={monitor.id} style={{ top: `${1 + index * 5}rem` }} className="fixed right-4 z-50">
          <TransactionMonitor
            signature={monitor.signature}
            onComplete={(success) => {
              monitor.onComplete?.(success);
              removeTransaction(monitor.id);
            }}
          />
        </div>
      ))}
    </>
  );

  return {
    addTransaction,
    removeTransaction,
    TransactionMonitors,
    activeTransactions: monitors.length
  };
}