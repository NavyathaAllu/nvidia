import React from 'react';
import { ArrowDown, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { FunnelMetrics, GrowthBottleneckStage } from '../types/growth';

interface FunnelVisualizerProps {
  metrics: FunnelMetrics;
  bottleneckStage: GrowthBottleneckStage;
}

export const FunnelVisualizer: React.FC<FunnelVisualizerProps> = ({
  metrics,
  bottleneckStage,
}) => {
  // Relative percentages of visitors for bar widths
  const visitorsCount = Math.max(1, metrics.visitors);
  const pVisitors = 100;
  const pSignups = Math.min(100, Math.round((metrics.signups / visitorsCount) * 100));
  const pActivated = Math.min(100, Math.round((metrics.activated / visitorsCount) * 100));
  const pReturning = Math.min(100, Math.round((metrics.returning / visitorsCount) * 100));

  const stages = [
    {
      id: 'visitors',
      name: '1. Total Visitors',
      subtitle: 'Top of Funnel Traffic',
      count: metrics.visitors,
      unit: 'visitors',
      widthPct: Math.max(15, pVisitors),
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      isBottleneck: bottleneckStage === 'acquisition',
      conversionNext: `${metrics.signupRate}% converted`,
      dropoffNext: `${metrics.visitorToSignupDropoff}% drop-off`,
      dropoffCount: Math.max(0, metrics.visitors - metrics.signups),
    },
    {
      id: 'signups',
      name: '2. Total Signups',
      subtitle: 'Account Registration',
      count: metrics.signups,
      unit: 'signups',
      widthPct: Math.max(12, pSignups),
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      isBottleneck: bottleneckStage === 'activation',
      conversionNext: `${metrics.activationRate}% converted`,
      dropoffNext: `${metrics.signupToActivationDropoff}% drop-off`,
      dropoffCount: Math.max(0, metrics.signups - metrics.activated),
    },
    {
      id: 'activated',
      name: '3. Activated Users',
      subtitle: 'First Meaningful Value',
      count: metrics.activated,
      unit: 'activated',
      widthPct: Math.max(9, pActivated),
      color: 'from-purple-600 to-amber-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      isBottleneck: bottleneckStage === 'retention',
      conversionNext: `${metrics.retentionProxyRate}% returned`,
      dropoffNext: `${metrics.activationToRetentionDropoff}% drop-off`,
      dropoffCount: Math.max(0, metrics.activated - metrics.returning),
    },
    {
      id: 'returning',
      name: '4. Returning Users',
      subtitle: 'Habit & Repeat Use',
      count: metrics.returning,
      unit: 'returning',
      widthPct: Math.max(6, pReturning),
      color: 'from-amber-600 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      isBottleneck: false,
      conversionNext: null,
      dropoffNext: null,
      dropoffCount: 0,
    },
  ];

  return (
    <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-purple-500"></span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Funnel Conversion & Stage-by-Stage Drop-Off
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual progression of your user journey from initial visit to returning habit.
          </p>
        </div>

        {bottleneckStage !== 'healthy' && bottleneckStage !== 'cold_start' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Bottleneck Detected in {bottleneckStage.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Visual Funnel Stack */}
      <div className="space-y-4 max-w-4xl mx-auto py-2">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="relative">
            {/* Stage Bar Card */}
            <div
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                stage.isBottleneck
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-white">{stage.name}</span>
                  <span className="text-xs text-slate-400">({stage.subtitle})</span>
                  {stage.isBottleneck && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-sm">
                      Primary Leak
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold font-mono text-white">
                    {stage.count.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">{stage.unit}</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-500`}
                  style={{ width: `${stage.widthPct}%` }}
                />
              </div>
            </div>

            {/* Drop-off connector between stages */}
            {stage.conversionNext && (
              <div className="flex items-center justify-between px-6 py-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-slate-300">{stage.conversionNext}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Lost:</span>
                  <span className="font-mono font-semibold text-rose-400">
                    -{stage.dropoffCount.toLocaleString()} ({stage.dropoffNext})
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Methodological Context Note */}
      <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-300">Methodological Note on Root Causes: </strong>
          The lowest stage conversion rate is a diagnostic signal pointing to where users stall, not definitive proof of the underlying product reason. Always corroborate numerical drop-offs with user session analysis or customer interviews.
        </div>
      </div>
    </div>
  );
};
