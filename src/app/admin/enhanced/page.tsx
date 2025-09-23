'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { 
  useMultiPresaleProjects, 
  useUserPurchases,
  usePlatformTreasury 
} from '@/hooks/useMultiPresale';
import { Navigation } from '@/components/Navigation';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play, 
  Ban, 
  UserCheck,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Wallet,
  Clock,
  Target,
  Award,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Globe,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface PlatformStats {
  totalProjects: number;
  activeProjects: number;
  totalRaised: number; // in SOL
  totalInvestors: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  averageProjectSize: number;
  successRate: number;
}

interface ProjectApproval {
  projectId: number;
  projectName: string;
  creator: string;
  submissionDate: Date;
  requestedAmount: number; // in SOL
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number; // 0-100
  documents: string[];
}

interface UserManagement {
  address: string;
  totalInvested: number;
  projectsInvested: number;
  joinDate: Date;
  status: 'active' | 'suspended' | 'banned';
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: Date;
}

interface PlatformConfig {
  baseFeePercent: number;
  successFeePercent: number;
  minProjectSize: number; // in SOL
  maxProjectSize: number; // in SOL
  approvalRequiredAbove: number; // in SOL
  vestingMinPeriod: number; // in days
  emergencyMode: boolean;
  maintenanceMode: boolean;
}

function usePlatformData() {
  const { data: projects } = useMultiPresaleProjects();
  const { data: treasury } = usePlatformTreasury();

  // Mock data for demonstration - in real app, this would come from backend analytics
  const mockStats: PlatformStats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter(p => p.status === 'active').length || 0,
    totalRaised: 12547.89, // Mock total
    totalInvestors: 3420,
    pendingApprovals: 7,
    monthlyRevenue: 376.44,
    averageProjectSize: 892.5,
    successRate: 78.5,
  };

  const mockApprovals: ProjectApproval[] = [
    {
      projectId: 101,
      projectName: 'DeFi Protocol X',
      creator: '9yWMvNbPKKB5Z4aXJQKyZGR8tF3xEr4qLp7VcNmZyPE',
      submissionDate: new Date('2024-01-15'),
      requestedAmount: 5000,
      category: 'DeFi',
      status: 'pending',
      riskScore: 25,
      documents: ['whitepaper.pdf', 'audit_report.pdf'],
    },
    {
      projectId: 102,
      projectName: 'GameFi Universe',
      creator: '7xRPqS8dGhMnL2wBvF9zKjT5yEp6VcNmZyPE3qW4uR1',
      submissionDate: new Date('2024-01-16'),
      requestedAmount: 15000,
      category: 'Gaming',
      status: 'pending',
      riskScore: 45,
      documents: ['game_design.pdf', 'tokenomics.pdf'],
    },
  ];

  const mockUsers: UserManagement[] = [
    {
      address: '9yWMvNbPKKB5Z4aXJQKyZGR8tF3xEr4qLp7VcNmZyPE',
      totalInvested: 2500.75,
      projectsInvested: 8,
      joinDate: new Date('2023-11-15'),
      status: 'active',
      riskLevel: 'low',
      lastActivity: new Date('2024-01-20'),
    },
    {
      address: '7xRPqS8dGhMnL2wBvF9zKjT5yEp6VcNmZyPE3qW4uR1',
      totalInvested: 890.25,
      projectsInvested: 3,
      joinDate: new Date('2023-12-01'),
      status: 'active',
      riskLevel: 'medium',
      lastActivity: new Date('2024-01-19'),
    },
  ];

  const mockConfig: PlatformConfig = {
    baseFeePercent: 2.5,
    successFeePercent: 5.0,
    minProjectSize: 1000,
    maxProjectSize: 100000,
    approvalRequiredAbove: 10000,
    vestingMinPeriod: 30,
    emergencyMode: false,
    maintenanceMode: false,
  };

  return { 
    stats: mockStats, 
    approvals: mockApprovals, 
    users: mockUsers, 
    config: mockConfig,
    treasury: treasury?.balance || 0 
  };
}

function PlatformOverview({ stats }: { stats: PlatformStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Total Projects</p>
            <p className="text-2xl font-bold text-mountain-900">{stats.totalProjects}</p>
            <p className="text-sm text-green-600">{stats.activeProjects} active</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Total Raised</p>
            <p className="text-2xl font-bold text-mountain-900">{stats.totalRaised.toLocaleString()} SOL</p>
            <p className="text-sm text-mountain-600">Avg: {stats.averageProjectSize.toFixed(0)} SOL</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Total Investors</p>
            <p className="text-2xl font-bold text-mountain-900">{stats.totalInvestors.toLocaleString()}</p>
            <p className="text-sm text-green-600">+12% this month</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mountain-600">Monthly Revenue</p>
            <p className="text-2xl font-bold text-mountain-900">{stats.monthlyRevenue.toFixed(2)} SOL</p>
            <p className="text-sm text-orange-600">{stats.pendingApprovals} pending approvals</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectApprovalQueue({ approvals }: { approvals: ProjectApproval[] }) {
  const [selectedApproval, setSelectedApproval] = useState<ProjectApproval | null>(null);

  const handleApprove = async (projectId: number) => {
    // Implementation for project approval
    console.log('Approving project:', projectId);
  };

  const handleReject = async (projectId: number) => {
    // Implementation for project rejection
    console.log('Rejecting project:', projectId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-mountain-900">Project Approval Queue</h3>
        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
          {approvals.length} pending
        </span>
      </div>

      <div className="space-y-4">
        {approvals.map(approval => (
          <div key={approval.projectId} className="border border-cream-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-mountain-900">{approval.projectName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    approval.riskScore < 30 ? 'bg-green-100 text-green-800' :
                    approval.riskScore < 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Risk: {approval.riskScore}%
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {approval.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-mountain-600 mb-3">
                  <div>
                    <span className="font-medium">Creator:</span>
                    <div className="font-mono text-xs">{approval.creator.slice(0, 8)}...{approval.creator.slice(-8)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Requested:</span>
                    <div>{approval.requestedAmount.toLocaleString()} SOL</div>
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span>
                    <div>{format(approval.submissionDate, 'MMM dd, yyyy')}</div>
                  </div>
                  <div>
                    <span className="font-medium">Documents:</span>
                    <div>{approval.documents.length} files</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedApproval(approval)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Review Details
                  </button>
                  {approval.documents.map(doc => (
                    <button
                      key={doc}
                      className="text-mountain-600 hover:text-mountain-800 text-sm"
                    >
                      <Download className="w-4 h-4 inline mr-1" />
                      {doc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleApprove(approval.projectId)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(approval.projectId)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {approvals.length === 0 && (
          <div className="text-center py-8 text-mountain-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p>No pending approvals</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TreasuryManagement({ treasury, config }: { treasury: number; config: PlatformConfig }) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-mountain-900 mb-6">Platform Treasury</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="text-sm text-mountain-600 mb-1">Current Balance</div>
          <div className="text-2xl font-bold text-mountain-900">{treasury.toFixed(2)} SOL</div>
          <div className="text-sm text-green-600">$32,450 USD (est.)</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4">
          <div className="text-sm text-mountain-600 mb-1">This Month Revenue</div>
          <div className="text-2xl font-bold text-mountain-900">376.44 SOL</div>
          <div className="text-sm text-blue-600">+23% from last month</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <div className="text-sm text-mountain-600 mb-1">Average Daily</div>
          <div className="text-2xl font-bold text-mountain-900">12.15 SOL</div>
          <div className="text-sm text-purple-600">Platform fees</div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Download className="w-4 h-4 inline mr-2" />
          Withdraw Funds
        </button>
        <button className="bg-mountain-600 hover:bg-mountain-700 text-white px-4 py-2 rounded-lg font-medium">
          <BarChart3 className="w-4 h-4 inline mr-2" />
          View Analytics
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
          <Download className="w-4 h-4 inline mr-2" />
          Export Report
        </button>
      </div>
    </div>
  );
}

function UserManagementPanel({ users }: { users: UserManagement[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = (address: string, action: 'suspend' | 'ban' | 'activate') => {
    console.log(`${action} user:`, address);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-mountain-900">User Management</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-mountain-400" />
            <input
              type="text"
              placeholder="Search by address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream-50">
            <tr>
              <th className="text-left p-3 font-medium text-mountain-900">User</th>
              <th className="text-left p-3 font-medium text-mountain-900">Invested</th>
              <th className="text-left p-3 font-medium text-mountain-900">Projects</th>
              <th className="text-left p-3 font-medium text-mountain-900">Risk Level</th>
              <th className="text-left p-3 font-medium text-mountain-900">Status</th>
              <th className="text-left p-3 font-medium text-mountain-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.address} className="border-t border-cream-200">
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.address.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-mono text-sm">{user.address.slice(0, 8)}...{user.address.slice(-8)}</div>
                      <div className="text-xs text-mountain-500">
                        Joined {format(user.joinDate, 'MMM yyyy')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-semibold">{user.totalInvested.toLocaleString()} SOL</div>
                  <div className="text-xs text-mountain-500">Total invested</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold">{user.projectsInvested}</div>
                  <div className="text-xs text-mountain-500">Projects</div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                    user.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex space-x-1">
                    {user.status === 'active' && (
                      <button
                        onClick={() => handleUserAction(user.address, 'suspend')}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Suspend User"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {user.status === 'suspended' && (
                      <button
                        onClick={() => handleUserAction(user.address, 'activate')}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Activate User"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleUserAction(user.address, 'ban')}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Ban User"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/users/${user.address}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlatformConfiguration({ config }: { config: PlatformConfig }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (key: keyof PlatformConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveConfig = () => {
    // Implementation for saving configuration
    console.log('Saving config:', localConfig);
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-mountain-900">Platform Configuration</h3>
        {hasChanges && (
          <button
            onClick={handleSaveConfig}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-mountain-900">Fee Configuration</h4>
          
          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Base Fee Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={localConfig.baseFeePercent}
                onChange={(e) => handleConfigChange('baseFeePercent', parseFloat(e.target.value))}
                className="w-full p-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mountain-500">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Success Fee Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={localConfig.successFeePercent}
                onChange={(e) => handleConfigChange('successFeePercent', parseFloat(e.target.value))}
                className="w-full p-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mountain-500">%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-mountain-900">Project Limits</h4>
          
          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Minimum Project Size (SOL)
            </label>
            <input
              type="number"
              value={localConfig.minProjectSize}
              onChange={(e) => handleConfigChange('minProjectSize', parseInt(e.target.value))}
              className="w-full p-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Maximum Project Size (SOL)
            </label>
            <input
              type="number"
              value={localConfig.maxProjectSize}
              onChange={(e) => handleConfigChange('maxProjectSize', parseInt(e.target.value))}
              className="w-full p-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Approval Required Above (SOL)
            </label>
            <input
              type="number"
              value={localConfig.approvalRequiredAbove}
              onChange={(e) => handleConfigChange('approvalRequiredAbove', parseInt(e.target.value))}
              className="w-full p-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-cream-200">
        <h4 className="font-medium text-mountain-900 mb-4">Emergency Controls</h4>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emergencyMode"
              checked={localConfig.emergencyMode}
              onChange={(e) => handleConfigChange('emergencyMode', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="emergencyMode" className="text-sm text-mountain-700">
              Emergency Mode (Pause all sales)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={localConfig.maintenanceMode}
              onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="maintenanceMode" className="text-sm text-mountain-700">
              Maintenance Mode
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedAdminDashboard() {
  const { connected, publicKey } = useWallet();
  const { isAdmin } = useAdminAccess();
  const { stats, approvals, users, config, treasury } = usePlatformData();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Shield className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-mountain-900 mb-6">
                Enhanced Admin Dashboard
              </h1>
              <p className="text-mountain-600 mb-8">
                Connect your wallet to access the enhanced admin panel with advanced platform management features.
              </p>
              <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-6 !py-3 !rounded-lg !transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-mountain-900 mb-6">
                Access Denied
              </h1>
              <p className="text-mountain-600 mb-8">
                You don't have permission to access the enhanced admin dashboard.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-mountain-600 hover:bg-mountain-700 text-white font-medium rounded-lg transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Enhanced Admin Dashboard</h1>
            <p className="text-xl text-white/90">
              Comprehensive platform management and analytics
            </p>
          </div>

          {/* Platform Overview */}
          <PlatformOverview stats={stats} />

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-1 p-6">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'approvals', label: 'Project Approvals', icon: CheckCircle },
                  { id: 'treasury', label: 'Treasury', icon: DollarSign },
                  { id: 'users', label: 'User Management', icon: Users },
                  { id: 'config', label: 'Configuration', icon: Settings },
                  { id: 'analytics', label: 'Analytics', icon: PieChart },
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
              {selectedTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-mountain-900 mb-4">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-mountain-600">Success Rate:</span>
                          <span className="font-semibold text-green-600">{stats.successRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mountain-600">Avg Project Size:</span>
                          <span className="font-semibold text-mountain-900">{stats.averageProjectSize.toLocaleString()} SOL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mountain-600">Platform Fee Income:</span>
                          <span className="font-semibold text-green-600">{stats.monthlyRevenue.toFixed(2)} SOL/month</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-mountain-900 mb-4">Recent Activity</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Project approved: DeFi Protocol
                        </div>
                        <div className="flex items-center text-blue-600">
                          <Users className="w-4 h-4 mr-2" />
                          New user registered
                        </div>
                        <div className="flex items-center text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Large project pending approval
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'approvals' && (
                <ProjectApprovalQueue approvals={approvals} />
              )}

              {selectedTab === 'treasury' && (
                <TreasuryManagement treasury={treasury} config={config} />
              )}

              {selectedTab === 'users' && (
                <UserManagementPanel users={users} />
              )}

              {selectedTab === 'config' && (
                <PlatformConfiguration config={config} />
              )}

              {selectedTab === 'analytics' && (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-mountain-900 mb-2">
                    Advanced Analytics
                  </h3>
                  <p className="text-mountain-600">
                    Detailed analytics and reporting features coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}