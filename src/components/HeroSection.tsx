import React from 'react';
import { ArrowDown, Play, ShieldAlert, Sparkles, Target, Zap } from 'lucide-react';

interface HeroSectionProps {
  onTryDemo: () => void;
  onScrollToForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTryDemo, onScrollToForm }) => {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16 border-b border-slate-800/60 bg-gradient-to-b from-[#0C1222] via-[#090D1A] to-[#090D1A]">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[300px] h-[200px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Diagnosis Before Marketing</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-normal">Find the leak before buying more water</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            You built the product.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
              Now find your users.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Marketing tools rush to generate ads and social posts. <strong className="text-white">LaunchPilot AI</strong> acts as your product doctor: analyzing your conversion funnel, identifying the exact leak, and prescribing two measurable experiments.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onTryDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all cursor-pointer ring-1 ring-white/20"
              aria-label="Try Instant Demo with ResumeSpark AI"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Try Demo (ResumeSpark AI)</span>
            </button>

            <button
              type="button"
              onClick={onScrollToForm}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
            >
              <span>Analyze My Startup</span>
              <ArrowDown className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

          {/* 3 Step Workflow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-left max-w-2xl mx-auto">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">1. Input Funnel</p>
                <p className="text-[11px] text-slate-400">Visitors, signups, activated & returning users.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">2. Isolate Bottleneck</p>
                <p className="text-[11px] text-slate-400">Separate factual evidence from hypotheses.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">3. Test 2 Experiments</p>
                <p className="text-[11px] text-slate-400">Actionable steps with clear success metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
