import React from 'react';
import { Users, UserCheck, Zap, Repeat, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { FunnelMetrics } from '../types/growth';

interface KpiCardsProps {
  metrics: FunnelMetrics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Visitors KPI */}
      <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Visitors</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {metrics.visitors.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">visits</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Sample volume</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
              metrics.sampleSizeTier === 'sufficient'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : metrics.sampleSizeTier === 'moderate'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {metrics.sampleSizeTier === 'sufficient'
              ? 'Sufficient Sample'
              : metrics.sampleSizeTier === 'moderate'
              ? 'Moderate Sample'
              : metrics.isZeroTraffic
              ? 'Zero Traffic'
              : 'Low Sample Warning'}
          </span>
        </div>
      </div>

      {/* 2. Visitor-to-Signup Conversion */}
      <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Signup Rate</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {metrics.signupRate}%
          </span>
          <span className="text-xs text-slate-400">
            ({metrics.signups.toLocaleString()} users)
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Stage Drop-off</span>
          <span className="font-mono text-slate-300 flex items-center gap-1 font-semibold text-rose-400">
            <TrendingDown className="w-3.5 h-3.5" />
            {metrics.visitorToSignupDropoff}%
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Benchmark: 5% – 15%</p>
      </div>

      {/* 3. Signup-to-Activation Conversion */}
      <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Activation Rate</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {metrics.activationRate}%
          </span>
          <span className="text-xs text-slate-400">
            ({metrics.activated.toLocaleString()} active)
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Stage Drop-off</span>
          <span className="font-mono flex items-center gap-1 font-semibold text-rose-400">
            <TrendingDown className="w-3.5 h-3.5" />
            {metrics.signupToActivationDropoff}%
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Benchmark: 25% – 45%</p>
      </div>

      {/* 4. Retention Proxy */}
      <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Retention Proxy</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Repeat className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {metrics.retentionProxyRate}%
          </span>
          <span className="text-xs text-slate-400">
            ({metrics.returning.toLocaleString()} returning)
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Drop-off proxy</span>
          <span className="font-mono flex items-center gap-1 font-semibold text-rose-400">
            <TrendingDown className="w-3.5 h-3.5" />
            {metrics.activationToRetentionDropoff}%
          </span>
        </div>
        <p className="text-[10px] text-amber-400/90 mt-1 flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
          <span>Proxy ratio (not cohort retention)</span>
        </p>
      </div>
    </div>
  );
};
