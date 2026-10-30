import React, { useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FlaskConical,
  ListOrdered,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Experiment } from '../types/growth';

interface ExperimentCardsProps {
  experiments: [Experiment, Experiment];
  bottleneckStage: string;
}

export const ExperimentCards: React.FC<ExperimentCardsProps> = ({
  experiments,
  bottleneckStage,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyExperiment = (exp: Experiment) => {
    const text = `Experiment: ${exp.title}
Target Stage: ${exp.stage}
Hypothesis: ${exp.hypothesis}
Why Worth Testing: ${exp.whyWorthTesting}
Execution Steps:
1. ${exp.executionSteps[0]}
2. ${exp.executionSteps[1]}
3. ${exp.executionSteps[2]}
Primary Metric: ${exp.primarySuccessMetric}
Duration: ${exp.suggestedPeriod}
Validation Signal: ${exp.expectedSignal}`;

    navigator.clipboard.writeText(text);
    setCopiedId(exp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Prescribed Growth Experiments (Exactly 2 Measurable Tests)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Focus your limited engineering and founder time. Test one bottleneck at a time before spending on ads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target: {bottleneckStage}</span>
          </span>
        </div>
      </div>

      {/* Grid of exactly 2 experiments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiments.map((exp, idx) => (
          <div
            key={exp.id}
            className="flex flex-col justify-between p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all shadow-md relative overflow-hidden"
          >
            {/* Experiment Number Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                <span>Experiment #{idx + 1}</span>
              </span>

              <button
                type="button"
                onClick={() => handleCopyExperiment(exp)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                title="Copy experiment details"
              >
                {copiedId === exp.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <h4 className="text-base font-bold text-white tracking-tight">
                {exp.title}
              </h4>

              {/* Hypothesis */}
              <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs">
                <span className="font-semibold text-indigo-300 block mb-1">Hypothesis:</span>
                <p className="text-slate-200 leading-relaxed">{exp.hypothesis}</p>
              </div>

              {/* Why worth testing */}
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block mb-0.5">Why it matters:</span>
                <p className="leading-relaxed text-slate-300">{exp.whyWorthTesting}</p>
              </div>

              {/* 3 Execution Steps */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3 Execution Steps:</span>
                </span>
                <ol className="space-y-1.5 pl-1">
                  {exp.executionSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2 text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-slate-700">
                        {sIdx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Metrics & Timeline Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Primary Metric: </span>
                  <span className="text-slate-400">{exp.primarySuccessMetric}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Observation Window: </span>
                  <span className="text-slate-400">{exp.suggestedPeriod}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Validation Signal: </span>
                  <span className="text-slate-400">{exp.expectedSignal}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
