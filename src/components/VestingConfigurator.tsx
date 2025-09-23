'use client';

import { useState } from 'react';
import { Clock, Calendar, Target, TrendingUp, Info, Lock, Unlock } from 'lucide-react';
import { format, addMonths, differenceInDays } from 'date-fns';

export interface VestingSchedule {
  id: string;
  name: string;
  description: string;
  cliff: number; // months
  vesting: number; // months  
  tge: number; // percentage (0-100)
  linear: boolean;
  milestones?: VestingMilestone[];
}

export interface VestingMilestone {
  month: number;
  percentage: number;
  description: string;
}

interface VestingConfiguratorProps {
  onSave: (schedule: VestingSchedule) => void;
  initialSchedule?: VestingSchedule;
  tokenAllocation: number;
}

export function VestingConfigurator({ onSave, initialSchedule, tokenAllocation }: VestingConfiguratorProps) {
  const [schedule, setSchedule] = useState<VestingSchedule>(
    initialSchedule || {
      id: '',
      name: '',
      description: '',
      cliff: 0,
      vesting: 12,
      tge: 0,
      linear: true,
      milestones: [],
    }
  );

  const [customMilestones, setCustomMilestones] = useState(false);

  // Predefined vesting templates
  const templates: VestingSchedule[] = [
    {
      id: 'seed',
      name: 'Seed Round',
      description: 'Conservative vesting for seed investors',
      cliff: 12,
      vesting: 24,
      tge: 5,
      linear: true,
    },
    {
      id: 'private',
      name: 'Private Round',
      description: 'Standard private sale vesting',
      cliff: 6,
      vesting: 18,
      tge: 10,
      linear: true,
    },
    {
      id: 'public',
      name: 'Public Sale',
      description: 'Quick liquidity for public participants',
      cliff: 3,
      vesting: 12,
      tge: 20,
      linear: true,
    },
    {
      id: 'team',
      name: 'Team & Advisors',
      description: 'Long-term alignment for team members',
      cliff: 12,
      vesting: 36,
      tge: 0,
      linear: true,
    },
    {
      id: 'milestone',
      name: 'Milestone-based',
      description: 'Performance-based vesting with milestones',
      cliff: 0,
      vesting: 24,
      tge: 10,
      linear: false,
      milestones: [
        { month: 0, percentage: 10, description: 'TGE' },
        { month: 6, percentage: 20, description: 'Product Launch' },
        { month: 12, percentage: 30, description: 'First Revenue' },
        { month: 18, percentage: 25, description: 'Partnership Goals' },
        { month: 24, percentage: 15, description: 'Final Release' },
      ],
    },
  ];

  const handleTemplateSelect = (template: VestingSchedule) => {
    setSchedule({ ...template });
    setCustomMilestones(!template.linear && !!template.milestones);
  };

  const addMilestone = () => {
    const newMilestone: VestingMilestone = {
      month: 0,
      percentage: 0,
      description: '',
    };
    setSchedule(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMilestone],
    }));
  };

  const updateMilestone = (index: number, milestone: VestingMilestone) => {
    setSchedule(prev => ({
      ...prev,
      milestones: prev.milestones?.map((m, i) => i === index ? milestone : m) || [],
    }));
  };

  const removeMilestone = (index: number) => {
    setSchedule(prev => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index) || [],
    }));
  };

  const calculateVestingSchedule = () => {
    const startDate = new Date();
    const cliffEndDate = addMonths(startDate, schedule.cliff);
    const vestingEndDate = addMonths(startDate, schedule.vesting);
    
    if (schedule.linear) {
      const tgeTokens = (schedule.tge / 100) * tokenAllocation;
      const vestingTokens = tokenAllocation - tgeTokens;
      const monthlyRelease = vestingTokens / (schedule.vesting - schedule.cliff);
      
      return {
        tgeTokens,
        monthlyRelease,
        totalMonths: schedule.vesting,
        cliffEndDate,
        vestingEndDate,
      };
    } else {
      const milestoneTokens = schedule.milestones?.reduce((sum, m) => sum + (m.percentage / 100) * tokenAllocation, 0) || 0;
      return {
        milestoneTokens,
        milestones: schedule.milestones || [],
        cliffEndDate,
        vestingEndDate,
      };
    }
  };

  const vestingCalc = calculateVestingSchedule();
  const totalPercentage = schedule.milestones?.reduce((sum, m) => sum + m.percentage, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-mountain-900 mb-2">Vesting Schedule Configurator</h2>
        <p className="text-mountain-600">
          Design token vesting schedules to align incentives and ensure long-term commitment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-mountain-900 mb-4">Quick Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    schedule.id === template.id 
                      ? 'border-sky-500 bg-sky-50' 
                      : 'border-mountain-200 hover:border-mountain-300'
                  }`}
                >
                  <div className="font-medium text-mountain-900">{template.name}</div>
                  <div className="text-sm text-mountain-600 mt-1">{template.description}</div>
                  <div className="text-xs text-mountain-500 mt-2">
                    {template.cliff}m cliff • {template.vesting}m total • {template.tge}% TGE
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Configuration */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-mountain-900 mb-4">Custom Configuration</h3>
            
            <div className="space-y-4">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Schedule Name
                  </label>
                  <input
                    type="text"
                    value={schedule.name}
                    onChange={(e) => setSchedule(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                    placeholder="e.g., Seed Round Vesting"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    TGE Release (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={schedule.tge}
                    onChange={(e) => setSchedule(prev => ({ ...prev, tge: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Description
                </label>
                <textarea
                  value={schedule.description}
                  onChange={(e) => setSchedule(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                  placeholder="Describe the vesting schedule purpose and terms"
                />
              </div>

              {/* Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Cliff Period (months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={schedule.cliff}
                    onChange={(e) => setSchedule(prev => ({ ...prev, cliff: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                  />
                  <p className="text-xs text-mountain-500 mt-1">No tokens released during cliff</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Total Vesting (months)
                  </label>
                  <input
                    type="number"
                    min={schedule.cliff}
                    max="120"
                    value={schedule.vesting}
                    onChange={(e) => setSchedule(prev => ({ ...prev, vesting: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                  />
                  <p className="text-xs text-mountain-500 mt-1">Total duration including cliff</p>
                </div>
              </div>

              {/* Vesting Type */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-3">
                  Vesting Type
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={schedule.linear}
                      onChange={() => {
                        setSchedule(prev => ({ ...prev, linear: true }));
                        setCustomMilestones(false);
                      }}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Linear Vesting</div>
                      <div className="text-sm text-mountain-600">Equal monthly releases after cliff</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!schedule.linear}
                      onChange={() => {
                        setSchedule(prev => ({ ...prev, linear: false }));
                        setCustomMilestones(true);
                      }}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Milestone-based</div>
                      <div className="text-sm text-mountain-600">Custom release schedule based on milestones</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Milestone Configuration */}
              {customMilestones && (
                <div className="border border-mountain-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-mountain-900">Milestones</h4>
                    <button
                      onClick={addMilestone}
                      className="px-3 py-1 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700"
                    >
                      Add Milestone
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {schedule.milestones?.map((milestone, index) => (
                      <div key={index} className="grid grid-cols-4 gap-3 items-center">
                        <input
                          type="number"
                          placeholder="Month"
                          value={milestone.month}
                          onChange={(e) => updateMilestone(index, { ...milestone, month: parseInt(e.target.value) || 0 })}
                          className="px-2 py-1 border border-mountain-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Percentage"
                          value={milestone.percentage}
                          onChange={(e) => updateMilestone(index, { ...milestone, percentage: parseFloat(e.target.value) || 0 })}
                          className="px-2 py-1 border border-mountain-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, { ...milestone, description: e.target.value })}
                          className="px-2 py-1 border border-mountain-300 rounded text-sm"
                        />
                        <button
                          onClick={() => removeMilestone(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {totalPercentage !== 100 && (
                    <div className={`mt-3 p-2 rounded text-sm ${
                      totalPercentage > 100 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      Total: {totalPercentage}% {totalPercentage > 100 ? '(exceeds 100%)' : '(incomplete)'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Schedule Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-mountain-900 mb-4">Schedule Preview</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-mountain-50 rounded-lg p-3">
                  <div className="text-sm text-mountain-600">Token Allocation</div>
                  <div className="text-lg font-semibold text-mountain-900">
                    {tokenAllocation.toLocaleString()} tokens
                  </div>
                </div>
                
                <div className="bg-mountain-50 rounded-lg p-3">
                  <div className="text-sm text-mountain-600">TGE Release</div>
                  <div className="text-lg font-semibold text-mountain-900">
                    {schedule.tge}% ({((schedule.tge / 100) * tokenAllocation).toLocaleString()} tokens)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-mountain-50 rounded-lg p-3">
                  <div className="text-sm text-mountain-600">Cliff Period</div>
                  <div className="text-lg font-semibold text-mountain-900">
                    {schedule.cliff} months
                  </div>
                </div>
                
                <div className="bg-mountain-50 rounded-lg p-3">
                  <div className="text-sm text-mountain-600">Vesting Duration</div>
                  <div className="text-lg font-semibold text-mountain-900">
                    {schedule.vesting} months
                  </div>
                </div>
              </div>

              {schedule.linear && (
                <div className="bg-sky-50 rounded-lg p-3">
                  <div className="text-sm text-sky-700">Monthly Release (after cliff)</div>
                  <div className="text-lg font-semibold text-sky-900">
                    {vestingCalc.monthlyRelease?.toLocaleString() || 0} tokens/month
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-mountain-900 mb-4">Release Timeline</h3>
            
            <VestingTimeline 
              schedule={schedule} 
              tokenAllocation={tokenAllocation}
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={() => onSave(schedule)}
              disabled={!schedule.name || (customMilestones && totalPercentage !== 100)}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 text-white font-medium py-3 rounded-lg"
            >
              Save Vesting Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VestingTimeline({ schedule, tokenAllocation }: { schedule: VestingSchedule; tokenAllocation: number }) {
  const startDate = new Date();
  const timelineMonths = Math.max(schedule.vesting, 24);
  
  const generateTimelineData = () => {
    const data = [];
    const tgeTokens = (schedule.tge / 100) * tokenAllocation;
    let cumulativeTokens = tgeTokens;
    
    // TGE
    data.push({
      month: 0,
      tokens: tgeTokens,
      cumulative: cumulativeTokens,
      label: 'TGE',
      isCliff: false,
    });

    if (schedule.linear) {
      const vestingTokens = tokenAllocation - tgeTokens;
      const monthlyRelease = vestingTokens / (schedule.vesting - schedule.cliff);
      
      for (let month = 1; month <= timelineMonths; month++) {
        let monthlyTokens = 0;
        
        if (month > schedule.cliff && month <= schedule.vesting) {
          monthlyTokens = monthlyRelease;
          cumulativeTokens += monthlyTokens;
        }
        
        data.push({
          month,
          tokens: monthlyTokens,
          cumulative: cumulativeTokens,
          label: month <= schedule.cliff ? 'Cliff' : `M${month}`,
          isCliff: month <= schedule.cliff,
        });
      }
    } else {
      // Milestone-based
      for (let month = 1; month <= timelineMonths; month++) {
        const milestone = schedule.milestones?.find(m => m.month === month);
        const monthlyTokens = milestone ? (milestone.percentage / 100) * tokenAllocation : 0;
        
        if (monthlyTokens > 0) {
          cumulativeTokens += monthlyTokens;
        }
        
        data.push({
          month,
          tokens: monthlyTokens,
          cumulative: cumulativeTokens,
          label: milestone ? milestone.description : `M${month}`,
          isCliff: month <= schedule.cliff,
        });
      }
    }
    
    return data;
  };

  const timelineData = generateTimelineData();
  const maxTokens = Math.max(...timelineData.map(d => d.tokens));

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="relative h-64 border border-mountain-200 rounded-lg p-4">
        <div className="flex items-end h-full space-x-1">
          {timelineData.slice(0, 24).map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              <div
                className={`w-full rounded-t transition-colors ${
                  point.isCliff 
                    ? 'bg-mountain-300' 
                    : point.tokens > 0 
                      ? 'bg-sky-500 hover:bg-sky-600' 
                      : 'bg-mountain-100'
                }`}
                style={{ 
                  height: `${maxTokens > 0 ? (point.tokens / maxTokens) * 100 : 0}%`,
                  minHeight: point.tokens > 0 ? '4px' : '2px'
                }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-mountain-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                <div>{point.label}</div>
                <div>{point.tokens.toLocaleString()} tokens</div>
                <div>Total: {point.cumulative.toLocaleString()}</div>
              </div>
              
              <div className="text-xs text-mountain-500 mt-1 transform -rotate-45 origin-top-left">
                {point.month === 0 ? 'TGE' : `M${point.month}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-mountain-300 rounded mr-2"></div>
          <span>Cliff Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-sky-500 rounded mr-2"></div>
          <span>Token Release</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-mountain-100 rounded mr-2"></div>
          <span>No Release</span>
        </div>
      </div>

      {/* Key Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-mountain-600">Cliff End Date</div>
          <div className="font-medium">
            {format(addMonths(startDate, schedule.cliff), 'MMM dd, yyyy')}
          </div>
        </div>
        <div>
          <div className="text-mountain-600">Vesting Complete</div>
          <div className="font-medium">
            {format(addMonths(startDate, schedule.vesting), 'MMM dd, yyyy')}
          </div>
        </div>
      </div>
    </div>
  );
}