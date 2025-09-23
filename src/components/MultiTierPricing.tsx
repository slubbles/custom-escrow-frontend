'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Target, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  tokenPrice: number; // in SOL
  minPurchase: number;
  maxPurchase: number;
  totalAllocation: number;
  soldTokens: number;
  startTime: Date;
  endTime: Date;
  priority: number; // lower number = higher priority
  requirements: TierRequirement[];
  bonuses: TierBonus[];
  isActive: boolean;
}

export interface TierRequirement {
  type: 'whitelist' | 'stake' | 'hold' | 'referral' | 'kyc';
  value?: string | number;
  description: string;
}

export interface TierBonus {
  type: 'percentage' | 'fixed' | 'vesting';
  value: number;
  description: string;
}

interface MultiTierPricingProps {
  onSave: (tiers: PricingTier[]) => void;
  initialTiers?: PricingTier[];
  projectId: string;
  totalTokenSupply: number;
}

export function MultiTierPricing({ onSave, initialTiers = [], projectId, totalTokenSupply }: MultiTierPricingProps) {
  const [tiers, setTiers] = useState<PricingTier[]>(initialTiers);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [showTierModal, setShowTierModal] = useState(false);

  // Default tier templates
  const tierTemplates: Partial<PricingTier>[] = [
    {
      name: 'VIP Tier',
      description: 'Exclusive access for major investors',
      tokenPrice: 0.001,
      minPurchase: 50000,
      maxPurchase: 500000,
      totalAllocation: 1000000,
      priority: 1,
      requirements: [
        { type: 'kyc', description: 'KYC verification required' },
        { type: 'whitelist', description: 'Invitation only' },
      ],
      bonuses: [
        { type: 'percentage', value: 20, description: '20% bonus tokens' },
        { type: 'vesting', value: 6, description: '6 month cliff reduction' },
      ],
    },
    {
      name: 'Early Bird',
      description: 'First come, first served discounted access',
      tokenPrice: 0.002,
      minPurchase: 10000,
      maxPurchase: 100000,
      totalAllocation: 2000000,
      priority: 2,
      requirements: [
        { type: 'whitelist', description: 'Whitelist required' },
      ],
      bonuses: [
        { type: 'percentage', value: 15, description: '15% bonus tokens' },
      ],
    },
    {
      name: 'Community',
      description: 'Open access for community members',
      tokenPrice: 0.003,
      minPurchase: 1000,
      maxPurchase: 25000,
      totalAllocation: 3000000,
      priority: 3,
      requirements: [
        { type: 'hold', value: '100 COMMUNITY', description: 'Hold 100 COMMUNITY tokens' },
      ],
      bonuses: [
        { type: 'percentage', value: 10, description: '10% bonus tokens' },
      ],
    },
    {
      name: 'Public Sale',
      description: 'Open to all participants',
      tokenPrice: 0.004,
      minPurchase: 100,
      maxPurchase: 10000,
      totalAllocation: 4000000,
      priority: 4,
      requirements: [],
      bonuses: [],
    },
  ];

  const addTier = (template?: Partial<PricingTier>) => {
    const newTier: PricingTier = {
      id: `tier-${Date.now()}`,
      name: template?.name || '',
      description: template?.description || '',
      tokenPrice: template?.tokenPrice || 0.001,
      minPurchase: template?.minPurchase || 100,
      maxPurchase: template?.maxPurchase || 10000,
      totalAllocation: template?.totalAllocation || 1000000,
      soldTokens: 0,
      startTime: new Date(),
      endTime: addDays(new Date(), 7),
      priority: tiers.length + 1,
      requirements: template?.requirements || [],
      bonuses: template?.bonuses || [],
      isActive: true,
    };
    
    setEditingTier(newTier);
    setShowTierModal(true);
  };

  const editTier = (tier: PricingTier) => {
    setEditingTier({ ...tier });
    setShowTierModal(true);
  };

  const saveTier = (tier: PricingTier) => {
    if (tier.id.startsWith('tier-')) {
      // New tier
      setTiers(prev => [...prev, tier].sort((a, b) => a.priority - b.priority));
    } else {
      // Edit existing tier
      setTiers(prev => prev.map(t => t.id === tier.id ? tier : t));
    }
    setShowTierModal(false);
    setEditingTier(null);
  };

  const deleteTier = (tierId: string) => {
    setTiers(prev => prev.filter(t => t.id !== tierId));
  };

  const moveTier = (tierId: string, direction: 'up' | 'down') => {
    setTiers(prev => {
      const tierIndex = prev.findIndex(t => t.id === tierId);
      if (tierIndex === -1) return prev;
      
      const newTiers = [...prev];
      const targetIndex = direction === 'up' ? tierIndex - 1 : tierIndex + 1;
      
      if (targetIndex < 0 || targetIndex >= newTiers.length) return prev;
      
      // Swap priorities
      const temp = newTiers[tierIndex].priority;
      newTiers[tierIndex].priority = newTiers[targetIndex].priority;
      newTiers[targetIndex].priority = temp;
      
      return newTiers.sort((a, b) => a.priority - b.priority);
    });
  };

  const calculateTotalAllocation = () => {
    return tiers.reduce((sum, tier) => sum + tier.totalAllocation, 0);
  };

  const calculateWeightedPrice = () => {
    const totalAllocation = calculateTotalAllocation();
    if (totalAllocation === 0) return 0;
    
    return tiers.reduce((sum, tier) => {
      const weight = tier.totalAllocation / totalAllocation;
      return sum + (tier.tokenPrice * weight);
    }, 0);
  };

  const getTierProgress = (tier: PricingTier) => {
    return tier.totalAllocation > 0 ? (tier.soldTokens / tier.totalAllocation) * 100 : 0;
  };

  const getTierStatus = (tier: PricingTier) => {
    const now = new Date();
    if (now < tier.startTime) return 'upcoming';
    if (now > tier.endTime) return 'ended';
    if (tier.soldTokens >= tier.totalAllocation) return 'sold-out';
    if (tier.isActive) return 'active';
    return 'paused';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'sold-out': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-mountain-900 mb-2">Multi-Tier Pricing Configuration</h2>
        <p className="text-mountain-600">
          Create multiple pricing tiers with different access requirements and bonuses
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-sky-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-mountain-900">{tiers.length}</div>
              <div className="text-sm text-mountain-600">Active Tiers</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-mountain-900">
                {calculateWeightedPrice().toFixed(4)}
              </div>
              <div className="text-sm text-mountain-600">Avg Price (SOL)</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-mountain-900">
                {calculateTotalAllocation().toLocaleString()}
              </div>
              <div className="text-sm text-mountain-600">Total Allocation</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-mountain-900">
                {((calculateTotalAllocation() / totalTokenSupply) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-mountain-600">Of Total Supply</div>
            </div>
          </div>
        </div>
      </div>

      {calculateTotalAllocation() > totalTokenSupply && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">
              Warning: Total tier allocation ({calculateTotalAllocation().toLocaleString()}) exceeds total token supply ({totalTokenSupply.toLocaleString()})
            </span>
          </div>
        </div>
      )}

      {/* Tier Templates */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-mountain-900">Quick Start Templates</h3>
          <button
            onClick={() => addTier()}
            className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Custom Tier
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tierTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => addTier(template)}
              className="text-left p-4 border border-mountain-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-colors"
            >
              <div className="font-medium text-mountain-900 mb-1">{template.name}</div>
              <div className="text-sm text-mountain-600 mb-2">{template.description}</div>
              <div className="text-xs text-mountain-500">
                {template.tokenPrice} SOL • {template.totalAllocation?.toLocaleString()} tokens
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tier List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-mountain-900">Current Tiers</h3>
        
        {tiers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Target className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-mountain-900 mb-2">No tiers configured</h3>
            <p className="text-mountain-600 mb-6">
              Add your first pricing tier to get started with multi-tier token sales.
            </p>
            <button
              onClick={() => addTier()}
              className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Tier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tiers.map((tier, index) => (
              <TierCard
                key={tier.id}
                tier={tier}
                onEdit={() => editTier(tier)}
                onDelete={() => deleteTier(tier.id)}
                onMoveUp={index > 0 ? () => moveTier(tier.id, 'up') : undefined}
                onMoveDown={index < tiers.length - 1 ? () => moveTier(tier.id, 'down') : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      {tiers.length > 0 && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => onSave(tiers)}
            disabled={calculateTotalAllocation() > totalTokenSupply}
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 text-white font-medium rounded-lg"
          >
            Save Pricing Configuration
          </button>
        </div>
      )}

      {/* Tier Modal */}
      {showTierModal && editingTier && (
        <TierModal
          tier={editingTier}
          onSave={saveTier}
          onClose={() => {
            setShowTierModal(false);
            setEditingTier(null);
          }}
        />
      )}
    </div>
  );
}

function TierCard({ 
  tier, 
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown 
}: { 
  tier: PricingTier;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const status = getTierStatus(tier);
  const progress = getTierProgress(tier);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-mountain-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="text-lg font-semibold text-mountain-900">{tier.name}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status.replace('-', ' ')}
            </span>
          </div>
          <p className="text-sm text-mountain-600">{tier.description}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-mountain-500 hover:text-mountain-700 hover:bg-mountain-100 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
          <span>{tier.soldTokens.toLocaleString()} sold</span>
          <span>{tier.totalAllocation.toLocaleString()} total</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="text-mountain-600">Price per Token</div>
          <div className="font-medium">{tier.tokenPrice.toFixed(4)} SOL</div>
        </div>
        <div>
          <div className="text-mountain-600">Purchase Range</div>
          <div className="font-medium">
            {tier.minPurchase.toLocaleString()} - {tier.maxPurchase.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-mountain-600">Start Time</div>
          <div className="font-medium">{format(tier.startTime, 'MMM dd, HH:mm')}</div>
        </div>
        <div>
          <div className="text-mountain-600">End Time</div>
          <div className="font-medium">{format(tier.endTime, 'MMM dd, HH:mm')}</div>
        </div>
      </div>

      {/* Requirements */}
      {tier.requirements.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-mountain-700 mb-2">Requirements</div>
          <div className="space-y-1">
            {tier.requirements.map((req, index) => (
              <div key={index} className="text-xs text-mountain-600 bg-mountain-50 rounded px-2 py-1">
                {req.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bonuses */}
      {tier.bonuses.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-mountain-700 mb-2">Bonuses</div>
          <div className="space-y-1">
            {tier.bonuses.map((bonus, index) => (
              <div key={index} className="text-xs text-green-600 bg-green-50 rounded px-2 py-1">
                {bonus.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Controls */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-mountain-600">
          Priority: {tier.priority}
        </div>
        <div className="flex space-x-2">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="px-3 py-1 text-xs bg-mountain-100 hover:bg-mountain-200 rounded"
            >
              Move Up
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="px-3 py-1 text-xs bg-mountain-100 hover:bg-mountain-200 rounded"
            >
              Move Down
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TierModal({ tier, onSave, onClose }: {
  tier: PricingTier;
  onSave: (tier: PricingTier) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(tier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-mountain-900">
            {tier.id.startsWith('tier-') ? 'Create Tier' : 'Edit Tier'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Tier Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Priority (1 = highest)
              </label>
              <input
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Pricing & Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Token Price (SOL)
              </label>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={formData.tokenPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenPrice: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Min Purchase
              </label>
              <input
                type="number"
                min="1"
                value={formData.minPurchase}
                onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Max Purchase
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxPurchase}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPurchase: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">
              Total Token Allocation
            </label>
            <input
              type="number"
              min="1"
              value={formData.totalAllocation}
              onChange={(e) => setFormData(prev => ({ ...prev, totalAllocation: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          {/* Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={format(formData.startTime, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: new Date(e.target.value) }))}
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
                value={format(formData.endTime, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: new Date(e.target.value) }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>

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
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg"
            >
              Save Tier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper functions (moved from component scope)
function getTierStatus(tier: PricingTier) {
  const now = new Date();
  if (now < tier.startTime) return 'upcoming';
  if (now > tier.endTime) return 'ended';
  if (tier.soldTokens >= tier.totalAllocation) return 'sold-out';
  if (tier.isActive) return 'active';
  return 'paused';
}

function getTierProgress(tier: PricingTier) {
  return tier.totalAllocation > 0 ? (tier.soldTokens / tier.totalAllocation) * 100 : 0;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'upcoming': return 'bg-yellow-100 text-yellow-800';
    case 'ended': return 'bg-gray-100 text-gray-800';
    case 'sold-out': return 'bg-purple-100 text-purple-800';
    case 'paused': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}