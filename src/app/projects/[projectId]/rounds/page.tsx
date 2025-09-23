'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  useMultiPresaleProject, 
  useSaleRounds, 
  useCreateSaleRound,
  useAddToWhitelist,
  useRemoveFromWhitelist 
} from '@/hooks/useMultiPresale';
import { 
  Plus, 
  Settings, 
  Users, 
  Calendar,
  Clock,
  Target,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { SaleType, SaleRound } from '@/lib/types';
import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

interface WhitelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  roundId: number;
  projectId: number;
  whitelistAddresses: string[];
  onAddressAdded: () => void;
}

function WhitelistModal({ isOpen, onClose, roundId, projectId, whitelistAddresses, onAddressAdded }: WhitelistModalProps) {
  const [newAddress, setNewAddress] = useState('');
  const [bulkAddresses, setBulkAddresses] = useState('');
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [importing, setImporting] = useState(false);

  const addToWhitelist = useAddToWhitelist();
  const removeFromWhitelist = useRemoveFromWhitelist();

  const handleSingleAdd = async () => {
    if (!newAddress.trim()) return;

    try {
      await addToWhitelist.mutateAsync({
        projectId,
        roundNumber: roundId,
        addresses: [new PublicKey(newAddress.trim())],
      });
      setNewAddress('');
      onAddressAdded();
      toast.success('Address added to whitelist');
    } catch (error) {
      console.error('Failed to add to whitelist:', error);
      toast.error('Failed to add address');
    }
  };

  const handleBulkAdd = async () => {
    const addresses = bulkAddresses
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);

    if (addresses.length === 0) return;

    setImporting(true);
    let successCount = 0;
    let failCount = 0;

    for (const address of addresses) {
      try {
        await addToWhitelist.mutateAsync({
          projectId,
          roundNumber: roundId,
          addresses: [new PublicKey(address)],
        });
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to add ${address}:`, error);
      }
    }

    setImporting(false);
    setBulkAddresses('');
    onAddressAdded();
    
    if (successCount > 0) {
      toast.success(`Added ${successCount} addresses to whitelist`);
    }
    if (failCount > 0) {
      toast.error(`Failed to add ${failCount} addresses`);
    }
  };

  const handleRemove = async (address: string) => {
    try {
      await removeFromWhitelist.mutateAsync({
        projectId,
        roundNumber: roundId,
        addresses: [new PublicKey(address)],
      });
      onAddressAdded();
      toast.success('Address removed from whitelist');
    } catch (error) {
      console.error('Failed to remove from whitelist:', error);
      toast.error('Failed to remove address');
    }
  };

  const exportWhitelist = () => {
    const csv = whitelistAddresses.join('\n');
    const blob = new Blob([csv], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whitelist-round-${roundId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-mountain-900">Manage Whitelist</h2>
            <button
              onClick={onClose}
              className="text-mountain-500 hover:text-mountain-700"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex h-[600px]">
          {/* Left Panel - Add Addresses */}
          <div className="w-1/2 p-6 border-r">
            <div className="mb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setMode('single')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    mode === 'single' 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-mountain-100 text-mountain-700'
                  }`}
                >
                  Single Address
                </button>
                <button
                  onClick={() => setMode('bulk')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    mode === 'bulk' 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-mountain-100 text-mountain-700'
                  }`}
                >
                  Bulk Import
                </button>
              </div>

              {mode === 'single' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Enter Solana wallet address"
                      className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400 font-mono text-sm"
                    />
                  </div>
                  <button
                    onClick={handleSingleAdd}
                    disabled={!newAddress.trim() || addToWhitelist.isPending}
                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 text-white font-medium py-3 rounded-lg"
                  >
                    {addToWhitelist.isPending ? 'Adding...' : 'Add to Whitelist'}
                  </button>
                </div>
              )}

              {mode === 'bulk' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Bulk Import (one address per line)
                    </label>
                    <textarea
                      value={bulkAddresses}
                      onChange={(e) => setBulkAddresses(e.target.value)}
                      placeholder="Paste wallet addresses, one per line"
                      rows={8}
                      className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400 font-mono text-sm"
                    />
                  </div>
                  <button
                    onClick={handleBulkAdd}
                    disabled={!bulkAddresses.trim() || importing}
                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 text-white font-medium py-3 rounded-lg"
                  >
                    {importing ? 'Importing...' : `Import ${bulkAddresses.split('\n').filter(a => a.trim()).length} Addresses`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Current Whitelist */}
          <div className="w-1/2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-mountain-900">
                Current Whitelist ({whitelistAddresses.length})
              </h3>
              {whitelistAddresses.length > 0 && (
                <button
                  onClick={exportWhitelist}
                  className="flex items-center px-3 py-2 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {whitelistAddresses.length === 0 ? (
                <div className="text-center py-8 text-mountain-500">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p>No addresses in whitelist yet</p>
                </div>
              ) : (
                whitelistAddresses.map((address, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-mountain-50 rounded-lg">
                    <span className="font-mono text-sm text-mountain-800">
                      {address.slice(0, 8)}...{address.slice(-8)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(address)}
                        className="p-1 text-mountain-500 hover:text-mountain-700"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(address)}
                        disabled={removeFromWhitelist.isPending}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove from whitelist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RoundConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  round?: SaleRound;
  onSuccess: () => void;
}

function RoundConfigModal({ isOpen, onClose, projectId, round, onSuccess }: RoundConfigModalProps) {
  const [formData, setFormData] = useState({
    roundNumber: 1,
    saleType: SaleType.PUBLIC,
    tokenPrice: '',
    totalTokens: '',
    startTime: '',
    endTime: '',
    maxTokensPerBuyer: '',
    whitelistRequired: false,
  });

  const createRound = useCreateSaleRound();

  useEffect(() => {
    if (round) {
      // Pre-populate form if editing existing round
      setFormData({
        roundNumber: round.roundNumber,
        saleType: round.saleType,
        tokenPrice: (Number(round.tokenPrice) / 1e9).toString(),
        totalTokens: (Number(round.totalTokens) / 1e9).toString(),
        startTime: format(new Date(Number(round.startTime) * 1000), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(new Date(Number(round.endTime) * 1000), "yyyy-MM-dd'T'HH:mm"),
        maxTokensPerBuyer: (Number(round.maxTokensPerBuyer) / 1e9).toString(),
        whitelistRequired: round.whitelistRequired,
      });
    }
  }, [round]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      
      await createRound.mutateAsync({
        projectId,
        roundNumber: formData.roundNumber,
        saleType: formData.saleType,
        tokenPrice: parseFloat(formData.tokenPrice),
        totalTokens: parseFloat(formData.totalTokens),
        startTime: Math.floor(startDate.getTime() / 1000),
        endTime: Math.floor(endDate.getTime() / 1000),
        maxTokensPerBuyer: parseFloat(formData.maxTokensPerBuyer),
        whitelistRequired: formData.whitelistRequired,
      });
      
      onSuccess();
      onClose();
      toast.success(round ? 'Round updated successfully' : 'Round created successfully');
    } catch (error) {
      console.error('Failed to save round:', error);
      toast.error('Failed to save round');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-mountain-900">
            {round ? 'Edit Sale Round' : 'Create Sale Round'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sale Type and Round Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Round Number
              </label>
              <input
                type="number"
                min="1"
                value={formData.roundNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roundNumber: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Sale Type
              </label>
              <select
                value={formData.saleType}
                onChange={(e) => setFormData(prev => ({ ...prev, saleType: e.target.value as SaleType }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              >
                {Object.values(SaleType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-mountain-500">
                {formData.saleType === SaleType.SEED && 'Early investors with highest discount'}
                {formData.saleType === SaleType.PRIVATE && 'Restricted access with moderate discount'}
                {formData.saleType === SaleType.PUBLIC && 'Open to all participants'}
              </p>
            </div>
          </div>

          {/* Pricing and Supply */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Token Price (SOL)
              </label>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={formData.tokenPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenPrice: e.target.value }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
              <p className="mt-1 text-sm text-mountain-500">
                Price per token in SOL
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Total Tokens Available
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalTokens}
                onChange={(e) => setFormData(prev => ({ ...prev, totalTokens: e.target.value }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
              <p className="mt-1 text-sm text-mountain-500">
                Total tokens allocated for this round
              </p>
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>

          {/* Purchase Limits */}
          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">
              Max Tokens Per Buyer
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxTokensPerBuyer}
              onChange={(e) => setFormData(prev => ({ ...prev, maxTokensPerBuyer: e.target.value }))}
              className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              required
            />
            <p className="mt-1 text-sm text-mountain-500">
              Maximum number of tokens one buyer can purchase
            </p>
          </div>

          {/* Whitelist Option */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="whitelistRequired"
              checked={formData.whitelistRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, whitelistRequired: e.target.checked }))}
              className="w-4 h-4 text-sky-600 border-mountain-300 rounded focus:ring-sky-500 mt-1"
            />
            <div className="ml-3">
              <label htmlFor="whitelistRequired" className="text-sm font-medium text-mountain-700">
                Require whitelist for this round
              </label>
              <p className="text-sm text-mountain-500">
                Only whitelisted addresses will be able to participate in this round
              </p>
            </div>
          </div>

          {/* Pricing Preview */}
          {formData.tokenPrice && formData.totalTokens && (
            <div className="bg-sky-50 rounded-lg p-4">
              <h4 className="font-medium text-sky-900 mb-2">Round Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-sky-700">Total Raise Potential:</span>
                  <div className="font-semibold text-sky-900">
                    {(parseFloat(formData.tokenPrice) * parseFloat(formData.totalTokens)).toFixed(2)} SOL
                  </div>
                </div>
                <div>
                  <span className="text-sky-700">Tokens per SOL:</span>
                  <div className="font-semibold text-sky-900">
                    {formData.tokenPrice ? (1 / parseFloat(formData.tokenPrice)).toFixed(2) : '0'} tokens
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-mountain-600 hover:text-mountain-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRound.isPending}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 text-white font-medium rounded-lg"
            >
              {createRound.isPending ? 'Saving...' : (round ? 'Update Round' : 'Create Round')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SaleRoundManagement() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.projectId as string);
  const { connected, publicKey } = useWallet();
  
  const [selectedTab, setSelectedTab] = useState('rounds');
  const [roundConfigModal, setRoundConfigModal] = useState<{ isOpen: boolean; round?: SaleRound }>({
    isOpen: false,
  });
  const [whitelistModal, setWhitelistModal] = useState<{ 
    isOpen: boolean; 
    roundId?: number; 
    addresses?: string[] 
  }>({
    isOpen: false,
  });

  const { data: project, refetch: refetchProject } = useMultiPresaleProject(projectId);
  const { data: saleRounds = [], refetch: refetchRounds } = useSaleRounds(projectId);

  // Check if current user is the project creator
  const isCreator = connected && publicKey && project && 
    project.creator.toString() === publicKey.toString();

  const handleCreateRound = () => {
    setRoundConfigModal({ isOpen: true });
  };

  const handleEditRound = (round: SaleRound) => {
    setRoundConfigModal({ isOpen: true, round });
  };

  const handleManageWhitelist = (roundId: number) => {
    // In a real implementation, fetch whitelist addresses from the blockchain
    const mockAddresses = [
      '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    ];
    setWhitelistModal({ isOpen: true, roundId, addresses: mockAddresses });
  };

  const handleRoundSaved = () => {
    refetchRounds();
    refetchProject();
  };

  const handleWhitelistUpdated = () => {
    // Refresh whitelist data
    refetchRounds();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-3xl font-bold text-mountain-900 mb-6">
                Sale Round Management
              </h1>
              <p className="text-mountain-600 mb-8">
                Connect your wallet to manage sale rounds.
              </p>
              <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-6 !py-3 !rounded-lg !transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-2xl font-bold text-mountain-900 mb-4">Project Not Found</h1>
              <p className="text-mountain-600">
                The project you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isCreator) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-mountain-900 mb-4">Access Denied</h1>
              <p className="text-mountain-600 mb-6">
                You don&apos;t have permission to manage this project&apos;s sale rounds.
              </p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-mountain-600 hover:bg-mountain-700 text-white font-medium rounded-lg"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeRounds = saleRounds.filter(round => round.isActive);
  const upcomingRounds = saleRounds.filter(round => 
    !round.isActive && Number(round.startTime) * 1000 > Date.now()
  );
  const completedRounds = saleRounds.filter(round => 
    !round.isActive && Number(round.endTime) * 1000 < Date.now()
  );

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Sale Round Management
                </h1>
                <p className="text-xl text-white/90">{project.name}</p>
              </div>
              <button
                onClick={handleCreateRound}
                className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Round
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-sky-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">{saleRounds.length}</div>
                  <div className="text-sm text-mountain-600">Total Rounds</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">{activeRounds.length}</div>
                  <div className="text-sm text-mountain-600">Active Rounds</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">{upcomingRounds.length}</div>
                  <div className="text-sm text-mountain-600">Upcoming</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">
                    {saleRounds.filter(r => r.whitelistRequired).length}
                  </div>
                  <div className="text-sm text-mountain-600">Whitelisted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex space-x-1">
                {[
                  { id: 'rounds', label: 'Sale Rounds', icon: Target },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTab === tab.id
                        ? 'bg-sky-600 text-white'
                        : 'text-mountain-600 hover:text-mountain-900 hover:bg-mountain-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {selectedTab === 'rounds' && (
                <div className="space-y-8">
                  {/* Active Rounds */}
                  {activeRounds.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-mountain-900 mb-4">
                        Active Rounds ({activeRounds.length})
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {activeRounds.map(round => (
                          <RoundCard 
                            key={round.roundNumber} 
                            round={round} 
                            onEdit={() => handleEditRound(round)}
                            onManageWhitelist={() => handleManageWhitelist(round.roundNumber)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Rounds */}
                  {upcomingRounds.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-mountain-900 mb-4">
                        Upcoming Rounds ({upcomingRounds.length})
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {upcomingRounds.map(round => (
                          <RoundCard 
                            key={round.roundNumber} 
                            round={round} 
                            onEdit={() => handleEditRound(round)}
                            onManageWhitelist={() => handleManageWhitelist(round.roundNumber)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Rounds */}
                  {completedRounds.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-mountain-900 mb-4">
                        Completed Rounds ({completedRounds.length})
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {completedRounds.map(round => (
                          <RoundCard 
                            key={round.roundNumber} 
                            round={round} 
                            onEdit={() => handleEditRound(round)}
                            onManageWhitelist={() => handleManageWhitelist(round.roundNumber)}
                            isCompleted={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {saleRounds.length === 0 && (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                        No sale rounds yet
                      </h3>
                      <p className="text-mountain-600 mb-6">
                        Create your first sale round to start raising funds.
                      </p>
                      <button
                        onClick={handleCreateRound}
                        className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Round
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'analytics' && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-mountain-600">
                    Detailed analytics for your sale rounds coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RoundConfigModal
        isOpen={roundConfigModal.isOpen}
        onClose={() => setRoundConfigModal({ isOpen: false })}
        projectId={projectId}
        round={roundConfigModal.round}
        onSuccess={handleRoundSaved}
      />

      <WhitelistModal
        isOpen={whitelistModal.isOpen}
        onClose={() => setWhitelistModal({ isOpen: false })}
        roundId={whitelistModal.roundId!}
        projectId={projectId}
        whitelistAddresses={whitelistModal.addresses || []}
        onAddressAdded={handleWhitelistUpdated}
      />
    </div>
  );
}

function RoundCard({ 
  round, 
  onEdit, 
  onManageWhitelist, 
  isCompleted = false 
}: { 
  round: SaleRound; 
  onEdit: () => void;
  onManageWhitelist: () => void;
  isCompleted?: boolean;
}) {
  const now = Date.now();
  const startTime = Number(round.startTime) * 1000;
  const endTime = Number(round.endTime) * 1000;
  const isActive = round.isActive;
  const isUpcoming = startTime > now;
  
  const progress = Number(round.totalTokens) > 0 
    ? (Number(round.tokensSold) / Number(round.totalTokens)) * 100 
    : 0;

  const getStatusColor = () => {
    if (isCompleted) return 'bg-gray-100 text-gray-800';
    if (isActive) return 'bg-green-100 text-green-800';
    if (isUpcoming) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isActive) return 'Active';
    if (isUpcoming) return 'Upcoming';
    return 'Inactive';
  };

  return (
    <div className="border border-mountain-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="text-lg font-semibold text-mountain-900">
              Round {round.roundNumber}
            </h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              round.saleType === SaleType.SEED ? 'bg-purple-100 text-purple-800' :
              round.saleType === SaleType.PRIVATE ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {round.saleType}
            </span>
          </div>
          <p className="text-sm text-mountain-600">
            {(Number(round.tokenPrice) / 1e9).toFixed(4)} SOL per token
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-mountain-500 hover:text-mountain-700 hover:bg-mountain-100 rounded-lg"
            title="Edit round"
          >
            <Edit className="w-4 h-4" />
          </button>
          {round.whitelistRequired && (
            <button
              onClick={onManageWhitelist}
              className="p-2 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg"
              title="Manage whitelist"
            >
              <Users className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-mountain-600 mb-2">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-mountain-200 rounded-full h-2">
          <div 
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-mountain-500 mt-1">
          <span>{(Number(round.tokensSold) / 1e9).toFixed(0)} sold</span>
          <span>{(Number(round.totalTokens) / 1e9).toFixed(0)} total</span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-mountain-600">Start Time</div>
          <div className="font-medium">
            {format(new Date(startTime), 'MMM dd, HH:mm')}
          </div>
        </div>
        <div>
          <div className="text-mountain-600">End Time</div>
          <div className="font-medium">
            {format(new Date(endTime), 'MMM dd, HH:mm')}
          </div>
        </div>
        <div>
          <div className="text-mountain-600">Max per Buyer</div>
          <div className="font-medium">
            {(Number(round.maxTokensPerBuyer) / 1e9).toFixed(0)} tokens
          </div>
        </div>
        <div>
          <div className="text-mountain-600">Whitelist</div>
          <div className="font-medium">
            {round.whitelistRequired ? 'Required' : 'Not Required'}
          </div>
        </div>
      </div>
    </div>
  );
}