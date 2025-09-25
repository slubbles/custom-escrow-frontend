import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import toast from 'react-hot-toast';
import { TransactionResult } from '@/lib/types';

// Hook for pausing/resuming individual sale rounds
export function usePauseSaleRound() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ projectId, roundNumber, pause }: { 
      projectId: number; 
      roundNumber: number; 
      pause: boolean; 
    }): Promise<TransactionResult> => {
      if (!publicKey) throw new Error('Wallet not connected');
      if (!signTransaction) throw new Error('Wallet does not support signing');

      try {
        // This would integrate with the smart contract to pause/resume rounds
        // For now, return a mock success result
        const action = pause ? 'paused' : 'resumed';
        
        return {
          success: true,
          signature: 'mock-signature-' + Date.now(),
          data: {
            projectId,
            roundNumber,
            action,
            timestamp: Date.now()
          }
        };
      } catch (error: any) {
        console.error('Pause/Resume operation failed:', error);
        return {
          success: false,
          signature: '',
          error: error.message || `Failed to ${pause ? 'pause' : 'resume'} sale round`
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        const action = variables.pause ? 'paused' : 'resumed';
        toast.success(`Sale round ${action} successfully!`);
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['multi-presale-projects'] });
        queryClient.invalidateQueries({ queryKey: ['sale-rounds'] });
      } else {
        toast.error(result.error || 'Operation failed');
      }
    },
    onError: (error: any) => {
      console.error('Pause/Resume mutation error:', error);
      toast.error('Failed to update sale round status');
    }
  });

  return mutation;
}

// Hook for emergency pause of entire platform
export function useEmergencyPause() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ pause }: { pause: boolean }): Promise<TransactionResult> => {
      if (!publicKey) throw new Error('Wallet not connected');
      if (!signTransaction) throw new Error('Wallet does not support signing');

      try {
        // This would integrate with the smart contract to pause/resume entire platform
        const action = pause ? 'paused' : 'resumed';
        
        return {
          success: true,
          signature: 'emergency-mock-signature-' + Date.now(),
          data: {
            platform: 'multi-presale',
            action,
            timestamp: Date.now(),
            authority: publicKey.toString()
          }
        };
      } catch (error: any) {
        console.error('Emergency pause operation failed:', error);
        return {
          success: false,
          signature: '',
          error: error.message || `Failed to ${pause ? 'pause' : 'resume'} platform`
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        const action = variables.pause ? 'paused' : 'resumed';
        toast.success(`Platform ${action} successfully!`);
        // Invalidate all queries since this affects the entire platform
        queryClient.invalidateQueries();
      } else {
        toast.error(result.error || 'Emergency operation failed');
      }
    },
    onError: (error: any) => {
      console.error('Emergency pause mutation error:', error);
      toast.error('Failed to update platform status');
    }
  });

  return mutation;
}

// Hook for withdrawing platform fees
export function useWithdrawPlatformFees() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ amount }: { amount?: number }): Promise<TransactionResult> => {
      if (!publicKey) throw new Error('Wallet not connected');
      if (!signTransaction) throw new Error('Wallet does not support signing');

      try {
        // This would integrate with the smart contract to withdraw fees
        return {
          success: true,
          signature: 'withdraw-mock-signature-' + Date.now(),
          data: {
            amount: amount || 0,
            recipient: publicKey.toString(),
            timestamp: Date.now()
          }
        };
      } catch (error: any) {
        console.error('Fee withdrawal failed:', error);
        return {
          success: false,
          signature: '',
          error: error.message || 'Failed to withdraw platform fees'
        };
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Platform fees withdrawn successfully!');
        // Invalidate platform and treasury queries
        queryClient.invalidateQueries({ queryKey: ['platform-info'] });
        queryClient.invalidateQueries({ queryKey: ['platform-treasury'] });
      } else {
        toast.error(result.error || 'Fee withdrawal failed');
      }
    },
    onError: (error: any) => {
      console.error('Fee withdrawal mutation error:', error);
      toast.error('Failed to withdraw platform fees');
    }
  });

  return mutation;
}

// Hook for updating platform configuration
export function useUpdatePlatformConfig() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ 
      platformFee, 
      minProjectDuration, 
      maxProjectDuration 
    }: { 
      platformFee?: number; 
      minProjectDuration?: number; 
      maxProjectDuration?: number; 
    }): Promise<TransactionResult> => {
      if (!publicKey) throw new Error('Wallet not connected');
      if (!signTransaction) throw new Error('Wallet does not support signing');

      try {
        // This would integrate with the smart contract to update platform config
        return {
          success: true,
          signature: 'config-update-mock-signature-' + Date.now(),
          data: {
            platformFee,
            minProjectDuration,
            maxProjectDuration,
            updatedBy: publicKey.toString(),
            timestamp: Date.now()
          }
        };
      } catch (error: any) {
        console.error('Platform config update failed:', error);
        return {
          success: false,
          signature: '',
          error: error.message || 'Failed to update platform configuration'
        };
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Platform configuration updated successfully!');
        // Invalidate platform queries
        queryClient.invalidateQueries({ queryKey: ['platform-info'] });
      } else {
        toast.error(result.error || 'Configuration update failed');
      }
    },
    onError: (error: any) => {
      console.error('Platform config mutation error:', error);
      toast.error('Failed to update platform configuration');
    }
  });

  return mutation;
}

// Hook for getting transaction status and details
export function useTransactionStatus() {
  const { connection } = useConnection();

  const checkTransaction = async (signature: string): Promise<{
    confirmed: boolean;
    success: boolean;
    error?: string;
    blockTime?: number;
    slot?: number;
  }> => {
    try {
      const status = await connection.getSignatureStatus(signature);
      const transaction = await connection.getTransaction(signature);

      return {
        confirmed: !!status.value?.confirmationStatus,
        success: !status.value?.err,
        error: status.value?.err ? JSON.stringify(status.value.err) : undefined,
        blockTime: transaction?.blockTime || undefined,
        slot: transaction?.slot || undefined,
      };
    } catch (error: any) {
      return {
        confirmed: false,
        success: false,
        error: error.message || 'Failed to check transaction status'
      };
    }
  };

  return { checkTransaction };
}

// Hook for bulk operations on multiple projects
export function useBulkProjectOperations() {
  const pauseSaleRound = usePauseSaleRound();
  const queryClient = useQueryClient();

  const bulkPause = async (projectIds: number[], pause: boolean) => {
    const results = [];
    
    for (const projectId of projectIds) {
      try {
        const result = await pauseSaleRound.mutateAsync({
          projectId,
          roundNumber: 0, // Default to first round
          pause
        });
        results.push({ projectId, success: result.success, error: result.error });
      } catch (error) {
        results.push({ 
          projectId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const action = pause ? 'paused' : 'resumed';
    
    if (successCount === projectIds.length) {
      toast.success(`All ${projectIds.length} projects ${action} successfully!`);
    } else if (successCount > 0) {
      toast.success(`${successCount} of ${projectIds.length} projects ${action} successfully`);
      toast.error(`${projectIds.length - successCount} projects failed to ${pause ? 'pause' : 'resume'}`);
    } else {
      toast.error(`Failed to ${pause ? 'pause' : 'resume'} any projects`);
    }

    return results;
  };

  return { bulkPause };
}