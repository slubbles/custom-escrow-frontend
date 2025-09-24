'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { usePlatformInfo } from '@/hooks/useMultiPresale';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader,
  Wifi,
  Wallet,
  Database,
  Settings,
  RefreshCw,
  ArrowLeft,
  Smartphone
} from 'lucide-react';

interface SystemCheck {
  name: string;
  status: 'checking' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export default function SystemTestPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: platformInfo, isLoading: platformLoading, error: platformError } = usePlatformInfo();
  const { isAdmin } = useAdminAccess();

  const [checks, setChecks] = useState<SystemCheck[]>([
    { name: 'Network Connection', status: 'checking', message: 'Connecting to Solana Devnet...' },
    { name: 'Wallet Status', status: 'checking', message: 'Checking wallet connection...' },
    { name: 'WalletConnect Setup', status: 'checking', message: 'Verifying WalletConnect configuration...' },
    { name: 'Program Access', status: 'checking', message: 'Verifying smart contract access...' },
    { name: 'Platform Status', status: 'checking', message: 'Checking platform initialization...' }
  ]);

  const [overallStatus, setOverallStatus] = useState<'checking' | 'success' | 'warning' | 'error'>('checking');
  const [userBalance, setUserBalance] = useState<number | null>(null);

  const runSystemChecks = async () => {
    const newChecks: SystemCheck[] = [];

    // Check 1: Network Connection
    try {
      const slot = await connection.getSlot();
      newChecks.push({
        name: 'Network Connection',
        status: 'success',
        message: 'Connected to Solana Devnet',
        details: `Latest slot: ${slot}`
      });
    } catch (error) {
      newChecks.push({
        name: 'Network Connection',
        status: 'error',
        message: 'Failed to connect to Solana network',
        details: error instanceof Error ? error.message : 'Unknown network error'
      });
    }

    // Check 2: Wallet Status
    if (connected && publicKey) {
      try {
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        setUserBalance(solBalance);
        
        newChecks.push({
          name: 'Wallet Status',
          status: solBalance > 0.01 ? 'success' : 'warning',
          message: 'Wallet connected',
          details: `Balance: ${solBalance.toFixed(4)} SOL`
        });
      } catch (error) {
        newChecks.push({
          name: 'Wallet Status',
          status: 'warning',
          message: 'Wallet connected but unable to fetch balance',
          details: 'May need to switch to Devnet'
        });
      }
    } else {
      newChecks.push({
        name: 'Wallet Status',
        status: 'warning',
        message: 'Wallet not connected',
        details: 'Connect your wallet to access all features'
      });
    }

    // Check 3: WalletConnect Setup
    const walletconnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (walletconnectProjectId && walletconnectProjectId !== 'your-walletconnect-project-id') {
      newChecks.push({
        name: 'WalletConnect Setup',
        status: 'success',
        message: 'WalletConnect configured',
        details: 'Project ID configured and ready for mobile wallet connections'
      });
    } else {
      newChecks.push({
        name: 'WalletConnect Setup',
        status: 'warning',
        message: 'WalletConnect not configured',
        details: 'Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local for mobile wallet support'
      });
    }

    // Check 4: Program Access
    try {
      const escrowProgramId = new PublicKey('HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4');
      const multiPresaleProgramId = new PublicKey('3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5');
      
      const escrowAccount = await connection.getAccountInfo(escrowProgramId);
      const multiPresaleAccount = await connection.getAccountInfo(multiPresaleProgramId);
      
      if (escrowAccount && multiPresaleAccount) {
        newChecks.push({
          name: 'Program Access',
          status: 'success',
          message: 'Smart contracts accessible',
          details: 'Both programs are deployed'
        });
      } else {
        newChecks.push({
          name: 'Program Access',
          status: 'error',
          message: 'Smart contracts not found',
          details: 'Programs not deployed to this network'
        });
      }
    } catch (error) {
      newChecks.push({
        name: 'Program Access',
        status: 'error',
        message: 'Failed to verify smart contracts',
        details: error instanceof Error ? error.message : 'Program verification failed'
      });
    }

    // Check 5: Platform Status
    if (platformError) {
      newChecks.push({
        name: 'Platform Status',
        status: 'warning',
        message: 'Platform not initialized',
        details: 'Multi-Presale platform needs initialization'
      });
    } else if (platformInfo) {
      newChecks.push({
        name: 'Platform Status',
        status: 'success',
        message: 'Platform initialized and ready',
        details: `Platform fee: ${platformInfo.platformFee / 100}%`
      });
    } else {
      newChecks.push({
        name: 'Platform Status',
        status: 'warning',
        message: 'Platform status unknown',
        details: 'Unable to determine status'
      });
    }

    setChecks(newChecks);

    // Determine overall status
    const hasError = newChecks.some(check => check.status === 'error');
    const hasWarning = newChecks.some(check => check.status === 'warning');
    
    if (hasError) {
      setOverallStatus('error');
    } else if (hasWarning) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('success');
    }
  };

  useEffect(() => {
    runSystemChecks();
  }, [connected, publicKey, platformInfo, platformError, platformLoading]);

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: SystemCheck['status']) => {
    switch (status) {
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'checking':
        return 'Running system diagnostics...';
      case 'success':
        return 'All systems operational';
      case 'warning':
        return 'System functional with minor issues';
      case 'error':
        return 'Critical system issues detected';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sky-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-mountain-600 hover:text-mountain-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-mountain-900 mb-2">System Status</h1>
          <p className="text-mountain-600">
            Real-time monitoring of platform health and blockchain connectivity
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(overallStatus)}
              <div>
                <h2 className="font-semibold text-mountain-900">
                  {getOverallStatusMessage()}
                </h2>
                <p className="text-sm text-mountain-600">
                  {overallStatus === 'success' 
                    ? 'Platform is ready for use'
                    : overallStatus === 'warning'
                    ? 'Some features may be limited'
                    : 'Please address critical issues'
                  }
                </p>
              </div>
            </div>
            
            <button
              onClick={runSystemChecks}
              className="flex items-center gap-2 px-4 py-2 bg-mountain-100 hover:bg-mountain-200 
                       text-mountain-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-mountain-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-mountain-500" />
                <span className="text-sm font-medium text-mountain-700">Network</span>
              </div>
              <div className={`text-xs ${
                checks.find(c => c.name === 'Network Connection')?.status === 'success' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {checks.find(c => c.name === 'Network Connection')?.status === 'success' 
                  ? 'Connected' 
                  : 'Disconnected'
                }
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-mountain-500" />
                <span className="text-sm font-medium text-mountain-700">Wallet</span>
              </div>
              <div className={`text-xs ${connected ? 'text-green-600' : 'text-yellow-600'}`}>
                {connected ? 'Connected' : 'Not Connected'}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Database className="w-4 h-4 text-mountain-500" />
                <span className="text-sm font-medium text-mountain-700">Programs</span>
              </div>
              <div className={`text-xs ${
                checks.find(c => c.name === 'Program Access')?.status === 'success' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {checks.find(c => c.name === 'Program Access')?.status === 'success' 
                  ? 'Accessible' 
                  : 'Unavailable'
                }
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-mountain-500" />
                <span className="text-sm font-medium text-mountain-700">WalletConnect</span>
              </div>
              <div className={`text-xs ${
                checks.find(c => c.name === 'WalletConnect Setup')?.status === 'success' 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {checks.find(c => c.name === 'WalletConnect Setup')?.status === 'success' 
                  ? 'Configured' 
                  : 'Not Configured'
                }
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Settings className="w-4 h-4 text-mountain-500" />
                <span className="text-sm font-medium text-mountain-700">Platform</span>
              </div>
              <div className={`text-xs ${
                checks.find(c => c.name === 'Platform Status')?.status === 'success' 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {checks.find(c => c.name === 'Platform Status')?.status === 'success' 
                  ? 'Ready' 
                  : 'Not Ready'
                }
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {checks.map((check, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 p-4 transition-all ${getStatusColor(check.status)}`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-mountain-900 mb-1">{check.name}</h3>
                  <p className="text-mountain-700 mb-1">{check.message}</p>
                  {check.details && (
                    <p className="text-sm text-mountain-600">{check.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {userBalance !== null && (
          <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-mountain-700">Your SOL Balance:</span>
              <span className={`font-semibold ${
                userBalance > 0.1 ? 'text-green-600' : userBalance > 0.01 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {userBalance.toFixed(4)} SOL
              </span>
            </div>
            {userBalance < 0.01 && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Low balance. You may need more SOL for transaction fees.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          {!connected && (
            <WalletMultiButton className="!bg-mountain-600 hover:!bg-mountain-700" />
          )}
          
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-2 bg-sky-600 hover:bg-sky-700 
                       text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
          
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2 bg-mountain-600 hover:bg-mountain-700 
                     text-white rounded-lg transition-colors"
          >
            <Database className="w-4 h-4" />
            View Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
