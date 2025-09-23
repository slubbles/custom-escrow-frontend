'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  useMultiPresaleProjects, 
  useCreateSaleRound,
  useSaleRounds 
} from '@/hooks/useMultiPresale';
import { 
  Plus, 
  Settings, 
  BarChart3, 
  Users, 
  Calendar,
  TrendingUp,
  Target,
  Clock,
  Edit,
  Eye,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { SaleType, ProjectStatus } from '@/lib/types';

interface CreateRoundModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateRoundModal({ projectId, isOpen, onClose, onSuccess }: CreateRoundModalProps) {
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
    } catch (error) {
      console.error('Failed to create round:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-mountain-900">Create Sale Round</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            </div>
          </div>

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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Total Tokens
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalTokens}
                onChange={(e) => setFormData(prev => ({ ...prev, totalTokens: e.target.value }))}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>

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
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="whitelistRequired"
              checked={formData.whitelistRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, whitelistRequired: e.target.checked }))}
              className="w-4 h-4 text-sky-600 border-mountain-300 rounded focus:ring-sky-500"
            />
            <label htmlFor="whitelistRequired" className="ml-2 text-sm text-mountain-700">
              Require whitelist for this round
            </label>
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
              disabled={createRound.isPending}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 text-white font-medium rounded-lg"
            >
              {createRound.isPending ? 'Creating...' : 'Create Round'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreatorDashboard() {
  const { connected, publicKey } = useWallet();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [createRoundModal, setCreateRoundModal] = useState<{ isOpen: boolean; projectId?: number }>({
    isOpen: false,
  });

  const { data: allProjects = [], refetch: refetchProjects } = useMultiPresaleProjects();
  
  // Filter projects created by the current user
  const myProjects = allProjects.filter(project => 
    publicKey && project.creator.toString() === publicKey.toString()
  );

  const handleCreateRound = (projectId: number) => {
    setCreateRoundModal({ isOpen: true, projectId });
  };

  const handleRoundCreated = () => {
    refetchProjects();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-3xl font-bold text-mountain-900 mb-6">
                Creator Dashboard
              </h1>
              <p className="text-mountain-600 mb-8">
                Connect your wallet to manage your projects and token sales.
              </p>
              <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-6 !py-3 !rounded-lg !transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeProjects = myProjects.filter(project => 
    Object.keys(project.status)[0] === 'active'
  );
  const totalRaised = myProjects.reduce((sum, project) => 
    sum + (Number(project.totalRaised) / 1e9), 0
  );
  const totalTarget = myProjects.reduce((sum, project) => 
    sum + (Number(project.targetAmount) / 1e9), 0
  );

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Creator Dashboard
            </h1>
            <p className="text-xl text-white/90">
              Manage your projects and token sales
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-sky-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">{myProjects.length}</div>
                  <div className="text-sm text-mountain-600">Total Projects</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">{activeProjects.length}</div>
                  <div className="text-sm text-mountain-600">Active Projects</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">{totalRaised.toFixed(2)} SOL</div>
                  <div className="text-sm text-mountain-600">Total Raised</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-mountain-900">
                    {totalTarget > 0 ? ((totalRaised / totalTarget) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-mountain-600">Avg Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-1">
              <div className="flex">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'projects', label: 'My Projects', icon: Target },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedTab === tab.id
                        ? 'bg-sky-600 text-white'
                        : 'text-mountain-600 hover:text-mountain-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {selectedTab === 'projects' && (
            <div className="space-y-6">
              {/* Create Project Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">My Projects</h2>
                <Link
                  href="/create-project"
                  className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Link>
              </div>

              {/* Projects List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onCreateRound={() => handleCreateRound(project.id)}
                  />
                ))}
                
                {myProjects.length === 0 && (
                  <div className="col-span-full">
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                      <Target className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                        No projects yet
                      </h3>
                      <p className="text-mountain-600 mb-6">
                        Create your first project to start raising funds through token sales.
                      </p>
                      <Link
                        href="/create-project"
                        className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Overview</h2>
              
              {myProjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Projects */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-mountain-900 mb-4">Recent Projects</h3>
                    <div className="space-y-4">
                      {myProjects.slice(0, 3).map(project => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-mountain-900">{project.name}</h4>
                            <p className="text-sm text-mountain-600">{project.category}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-mountain-900">
                              {(Number(project.totalRaised) / 1e9).toFixed(2)} SOL
                            </div>
                            <div className="text-xs text-mountain-500">raised</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-mountain-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        href="/create-project"
                        className="flex items-center p-4 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5 text-sky-600 mr-3" />
                        <span className="font-medium text-sky-900">Create New Project</span>
                        <ChevronRight className="w-4 h-4 text-sky-600 ml-auto" />
                      </Link>
                      
                      <button 
                        onClick={() => setSelectedTab('projects')}
                        className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors w-full"
                      >
                        <Settings className="w-5 h-5 text-green-600 mr-3" />
                        <span className="font-medium text-green-900">Manage Projects</span>
                        <ChevronRight className="w-4 h-4 text-green-600 ml-auto" />
                      </button>
                      
                      <button 
                        onClick={() => setSelectedTab('analytics')}
                        className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors w-full"
                      >
                        <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="font-medium text-purple-900">View Analytics</span>
                        <ChevronRight className="w-4 h-4 text-purple-600 ml-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Target className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                    Welcome to your Creator Dashboard
                  </h3>
                  <p className="text-mountain-600 mb-6">
                    Start by creating your first project to launch token sales and raise funds.
                  </p>
                  <Link
                    href="/create-project"
                    className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Link>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics</h2>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <BarChart3 className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-mountain-600">
                  Detailed analytics and insights for your projects will be available soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Round Modal */}
      <CreateRoundModal
        projectId={createRoundModal.projectId!}
        isOpen={createRoundModal.isOpen}
        onClose={() => setCreateRoundModal({ isOpen: false })}
        onSuccess={handleRoundCreated}
      />
    </div>
  );
}

function ProjectCard({ project, onCreateRound }: { 
  project: any; 
  onCreateRound: () => void;
}) {
  const { data: saleRounds = [] } = useSaleRounds(project.id);
  const totalRaised = Number(project.totalRaised) / 1e9;
  const targetAmount = Number(project.targetAmount) / 1e9;
  const progress = targetAmount > 0 ? (totalRaised / targetAmount) * 100 : 0;
  const activeRounds = saleRounds.filter(round => round.isActive);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-mountain-900 mb-1">{project.name}</h3>
            <p className="text-mountain-600">{project.category}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            Object.keys(project.status)[0] === 'active' ? 'bg-green-100 text-green-800' :
            Object.keys(project.status)[0] === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {Object.keys(project.status)[0].charAt(0).toUpperCase() + Object.keys(project.status)[0].slice(1)}
          </span>
        </div>

        <p className="text-mountain-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-mountain-900">{totalRaised.toFixed(2)}</div>
            <div className="text-xs text-mountain-600">SOL Raised</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-mountain-900">{saleRounds.length}</div>
            <div className="text-xs text-mountain-600">Sale Rounds</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-mountain-900">{activeRounds.length}</div>
            <div className="text-xs text-mountain-600">Active</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-mountain-600 mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-mountain-200 rounded-full h-2">
            <div 
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-mountain-100 hover:bg-mountain-200 text-mountain-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>
          <button
            onClick={onCreateRound}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Round
          </button>
        </div>
      </div>
    </div>
  );
}