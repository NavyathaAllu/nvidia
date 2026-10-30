import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';
import { GrowthDiagnosis } from '../types/growth';

interface DiagnosisCardProps {
  diagnosis: GrowthDiagnosis;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ diagnosis }) => {
  const isCritical = diagnosis.severity === 'critical';
  const isHealthy = diagnosis.severity === 'healthy';
  const isInfo = diagnosis.severity === 'info';

  return (
    <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Growth Diagnosis & Root Cause Analysis
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Separating factual funnel observations from plausible psychological and product hypotheses.
          </p>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isCritical
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : isHealthy
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
            }`}
          >
            {isCritical && <ShieldAlert className="w-3.5 h-3.5" />}
            {isHealthy && <CheckCircle2 className="w-3.5 h-3.5" />}
            {isInfo && <HelpCircle className="w-3.5 h-3.5" />}
            <span>Stage: {diagnosis.stageName}</span>
          </span>
        </div>
      </div>

      {/* Main Diagnostic Finding Banner */}
      <div
        className={`p-5 rounded-xl border ${
          isCritical
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            : isHealthy
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            : 'bg-blue-950/20 border-blue-500/30 text-blue-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isCritical
                ? 'bg-rose-500/20 text-rose-400'
                : isHealthy
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {diagnosis.headline}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {diagnosis.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Factual Evidence vs Plausible Hypotheses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Factual Observed Evidence */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 pb-2 border-b border-slate-800">
            <Search className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              1. Observed Funnel Evidence (Facts)
            </h5>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {diagnosis.observedEvidence.map((ev, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Plausible Hypotheses (Potential Causes) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <Lightbulb className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              2. Plausible Causes (Hypotheses to Validate)
            </h5>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {diagnosis.possibleCauses.map((cause, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Discovery Action */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-slate-900 border border-indigo-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Recommended Qualitative Discovery Action
            </h5>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {diagnosis.recommendedDiscovery}
            </p>
          </div>
        </div>
      </div>

      {/* Caveats, Benchmarks & Sample Warnings */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Scientific Discipline & Benchmark Context</span>
        </div>
        <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px] leading-relaxed">
          {diagnosis.caveatsAndWarnings.map((w, idx) => (
            <li key={idx}>{w}</li>
          ))}
          <li>{diagnosis.benchmarkContext}</li>
        </ul>
      </div>
    </div>
  );
};
