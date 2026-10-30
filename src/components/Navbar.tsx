import React from 'react';
import { Activity, Download, Play, RotateCcw, Cpu, Sparkles } from 'lucide-react';

interface NavbarProps {
  onLoadDemo: () => void;
  onDownloadReport: () => void;
  onReset: () => void;
  onOpenNebiusModal: () => void;
  nebiusConfigured: boolean;
  hasAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadDemo,
  onDownloadReport,
  onReset,
  onOpenNebiusModal,
  nebiusConfigured,
  hasAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D1A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                LaunchPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Growth Doctor
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              You built the product. Now find your users.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode status badge */}
          <button
            type="button"
            onClick={onOpenNebiusModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer bg-slate-900/60 hover:bg-slate-800/80 border-slate-700/60 text-slate-300"
            title="Click to view AI Engine details and Nebius configuration"
          >
            {nebiusConfigured ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-300">Nebius / Nemotron</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-300">Rule Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              </>
            )}
          </button>

          {/* Try Demo Button */}
          <button
            type="button"
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer ring-1 ring-white/10"
            aria-label="Try Demo Scenario"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Try Demo</span>
          </button>

          {/* Download Report Button */}
          {hasAnalysis && (
            <button
              type="button"
              onClick={onDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 transition-all cursor-pointer"
              aria-label="Download Diagnostic Report"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Report</span>
            </button>
          )}

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            title="Reset to default"
            aria-label="Reset Form and Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
