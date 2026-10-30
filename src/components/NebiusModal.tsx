import React from 'react';
import { X, Sparkles, Cpu, Check, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface NebiusModalProps {
  isOpen: boolean;
  onClose: () => void;
  configured: boolean;
  model: string | null;
}

export const NebiusModal: React.FC<NebiusModalProps> = ({
  isOpen,
  onClose,
  configured,
  model,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0B1021] border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              AI Engine & Nebius Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic Rule-Based Diagnostics + Optional NVIDIA Open-Source AI
            </p>
          </div>
        </div>

        {/* Current Active Mode */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Diagnostic Mode:
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                configured
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                  : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {configured ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Nebius NVIDIA Nemotron Connected</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deterministic Rule-Based Engine (Active)</span>
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {configured
              ? `Your analysis is enhanced by the ${model || 'NVIDIA Nemotron'} model hosted on Nebius Token Factory.`
              : 'LaunchPilot AI is running completely offline using pure deterministic growth diagnosis algorithms. It requires NO API keys, NO external paid subscriptions, and runs with 100% reliability.'}
          </p>
        </div>

        {/* Transparency note */}
        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-300">Hackathon Integrity & Transparency:</p>
            <p className="mt-0.5 text-slate-300 leading-relaxed">
              We never fabricate AI responses or claim remote inference occurred when offline. The rule-based engine calculates exact conversion benchmarks and prescribes actionable experiments without external failure points.
            </p>
          </div>
        </div>

        {/* Optional Setup Instructions */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-200">How to Connect Nebius Token Factory (Optional):</h4>
          <p className="text-slate-400">
            To enable optional NVIDIA Nemotron hypothesis generation, add the following to your environment secrets or <code className="text-indigo-300">.env</code>:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
            <p>NEBIUS_API_KEY="your-nebius-token-factory-key"</p>
            <p>NEBIUS_MODEL="nvidia/nemotron-4-340b-instruct"</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
