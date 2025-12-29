
import React from 'react';
import { DengueCase } from '../types';
import { Activity, ShieldCheck, AlertTriangle, HeartPulse, TrendingUp, Users } from 'lucide-react';

interface DashboardProps {
  cases: DengueCase[];
  onNavigateToCases: (filter?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ cases, onNavigateToCases }) => {
  const stats = {
    total: cases.length,
    confirmed: cases.filter(c => c.status === 'Confirmed').length,
    suspected: cases.filter(c => c.status === 'Suspected').length,
    recovered: cases.filter(c => c.status === 'Recovered').length,
    critical: cases.filter(c => c.status === 'Critical').length,
  };

  const kpis = [
    { 
      label: 'Confirmed', 
      value: stats.confirmed, 
      icon: <HeartPulse className="text-red-600" size={14} />, 
      color: 'border-red-500', 
      bg: 'bg-red-50',
      status: 'Confirmed'
    },
    { 
      label: 'Suspected', 
      value: stats.suspected, 
      icon: <AlertTriangle className="text-amber-600" size={14} />, 
      color: 'border-amber-500', 
      bg: 'bg-amber-50',
      status: 'Suspected'
    },
    { 
      label: 'Recovered', 
      value: stats.recovered, 
      icon: <ShieldCheck className="text-green-600" size={14} />, 
      color: 'border-green-500', 
      bg: 'bg-green-50',
      status: 'Recovered'
    },
    { 
      label: 'Critical', 
      value: stats.critical, 
      icon: <Activity className="text-purple-600" size={14} />, 
      color: 'border-purple-500', 
      bg: 'bg-purple-50',
      status: 'Critical'
    },
  ];

  return (
    <div className="p-3 md:p-4 max-w-7xl mx-auto animate-fade-in pb-20 md:pb-4 space-y-3">
      {/* Mini Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-none">Operational Metrics</h2>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-1">Surveillance Pulse</p>
        </div>
        <div className="flex items-center gap-2 bg-primary-900 text-white px-3 py-1.5 rounded-lg shadow-sm">
          <Users size={14} className="text-primary-300" />
          <span className="text-xs font-black">{stats.total}</span>
          <span className="text-[9px] font-bold text-primary-300 uppercase hidden sm:inline">Total Cases</span>
        </div>
      </div>

      {/* KPI Row - Compact Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {kpis.map((kpi) => (
          <div 
            key={kpi.label}
            onClick={() => onNavigateToCases(kpi.status)}
            className={`bg-white border border-gray-100 border-l-4 ${kpi.color} rounded-lg p-2.5 hover:shadow-sm transition-all cursor-pointer active:scale-[0.98] flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase">{kpi.label}</span>
              <div className={`p-1 rounded ${kpi.bg}`}>{kpi.icon}</div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-black text-gray-900 leading-none">{kpi.value}</h3>
              <span className="text-[9px] text-gray-400 font-bold">
                {stats.total > 0 ? Math.round((kpi.value / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Quicklinks Section */}
      <div className="bg-gray-900 rounded-lg p-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Analysis Hub</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            Current load shows <span className="text-white font-bold">{stats.confirmed}</span> confirmed reports. Priority response recommended for critical cases.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => onNavigateToCases('All')}
            className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white text-[11px] font-bold rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5"
          >
            Directory <TrendingUp size={12} />
          </button>
          <button 
            onClick={() => onNavigateToCases('Critical')}
            className="flex-1 sm:flex-none px-4 py-2 bg-red-600/20 text-red-400 border border-red-900/50 text-[11px] font-bold rounded-md hover:bg-red-600/30 transition-colors"
          >
            Priority
          </button>
        </div>
      </div>
    </div>
  );
};
