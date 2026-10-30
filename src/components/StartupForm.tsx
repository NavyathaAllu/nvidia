import React, { useState } from 'react';
import {
  AlertCircle,
  HelpCircle,
  Sparkles,
  Users,
  UserCheck,
  Zap,
  Repeat,
  CheckCircle2,
} from 'lucide-react';
import { StartupInput, ValidationErrors } from '../types/growth';
import { DEMO_STARTUP_DATA, validateStartupInput } from '../engine/growthEngine';

interface StartupFormProps {
  initialData: StartupInput;
  onSubmit: (data: StartupInput) => void;
  onLoadDemo: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const StartupForm: React.FC<StartupFormProps> = ({
  initialData,
  onSubmit,
  onLoadDemo,
  onReset,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StartupInput>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Sync state if initialData changes (e.g. from Try Demo)
  React.useEffect(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  const handleChange = (
    field: keyof StartupInput,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error as user types
    if (errors[field as keyof ValidationErrors] || errors.funnelRelational) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof ValidationErrors];
        delete next.funnelRelational;
        return next;
      });
    }
  };

  const handleNumberChange = (
    field: 'visitors' | 'signups' | 'activated' | 'returning',
    valStr: string
  ) => {
    if (valStr === '') {
      handleChange(field, 0);
      return;
    }
    const parsed = parseInt(valStr, 10);
    handleChange(field, isNaN(parsed) ? 0 : parsed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateStartupInput(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  const toggleTooltip = (key: string) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    <div id="startup-form-section" className="bg-[#0B1021] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Startup Information & Funnel Metrics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter your product context and current funnel volume. All calculations run instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Demo (ResumeSpark)</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          >
            Reset Form
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Relational Error Banner */}
        {errors.funnelRelational && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-300">Funnel Consistency Error</p>
              <p className="mt-0.5 text-rose-200/90">{errors.funnelRelational}</p>
              <p className="mt-1 text-[11px] text-rose-300/70">
                Rule: A user cannot be counted in a downstream stage without first passing through the prior step (Visitors ≥ Signups ≥ Activated ≥ Returning).
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Product Context */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <span>A. Product Context</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label htmlFor="productName" className="block text-xs font-semibold text-slate-200 mb-1.5">
                Product Name <span className="text-indigo-400">*</span>
              </label>
              <input
                id="productName"
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder="e.g., ResumeSpark AI"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.productName
                    ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/30'
                    : 'border-slate-700/80 focus:border-indigo-500 ring-1 ring-transparent focus:ring-indigo-500/20'
                }`}
              />
              {errors.productName && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.productName}</span>
                </p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="targetAudience" className="block text-xs font-semibold text-slate-200 mb-1.5">
                Target Audience / Ideal Customer Profile <span className="text-indigo-400">*</span>
              </label>
              <input
                id="targetAudience"
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                placeholder="e.g., College students & recent graduates"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.targetAudience
                    ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/30'
                    : 'border-slate-700/80 focus:border-indigo-500 ring-1 ring-transparent focus:ring-indigo-500/20'
                }`}
              />
              {errors.targetAudience && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.targetAudience}</span>
                </p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-xs font-semibold text-slate-200 mb-1.5">
              Product Description & Core Value Proposition <span className="text-indigo-400">*</span>
            </label>
            <textarea
              id="productDescription"
              rows={2}
              value={formData.productDescription}
              onChange={(e) => handleChange('productDescription', e.target.value)}
              placeholder="What does your product do, and what specific problem does it solve for your users?"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                errors.productDescription
                  ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/30'
                  : 'border-slate-700/80 focus:border-indigo-500 ring-1 ring-transparent focus:ring-indigo-500/20'
              }`}
            />
            {errors.productDescription && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.productDescription}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website URL (optional) */}
            <div>
              <label htmlFor="websiteUrl" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Website URL <span className="text-slate-500 text-[11px]">(Optional)</span>
              </label>
              <input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl || ''}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                placeholder="https://yourproduct.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Growth Challenge (optional) */}
            <div>
              <label htmlFor="growthChallenge" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Main Growth Challenge <span className="text-slate-500 text-[11px]">(Optional)</span>
              </label>
              <input
                id="growthChallenge"
                type="text"
                value={formData.growthChallenge || ''}
                onChange={(e) => handleChange('growthChallenge', e.target.value)}
                placeholder="e.g., Getting clicks from Reddit but low engagement"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Funnel Metrics */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span>B. Conversion Funnel Metrics (Nonnegative Integers)</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Rule: Visitors ≥ Signups ≥ Activated ≥ Returning
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Visitors */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="visitors" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Total Visitors</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('visitors')}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="What is Total Visitors?"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeTooltip === 'visitors' && (
                  <div className="p-2.5 mb-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-[11px] text-blue-200 leading-snug">
                    Total unique individuals landing on your website or landing page within the measurement period.
                  </div>
                )}
                <input
                  id="visitors"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.visitors}
                  onChange={(e) => handleNumberChange('visitors', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-base font-mono font-semibold text-white focus:outline-none transition-colors ${
                    errors.visitors
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-slate-700 focus:border-blue-400'
                  }`}
                />
              </div>
              {errors.visitors && (
                <p className="text-[11px] text-rose-400 mt-1.5">{errors.visitors}</p>
              )}
              <span className="text-[11px] text-slate-400 mt-2 block">Top of funnel baseline</span>
            </div>

            {/* 2. Signups */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="signups" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Total Signups</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('signups')}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="What is Total Signups?"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeTooltip === 'signups' && (
                  <div className="p-2.5 mb-2 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-[11px] text-indigo-200 leading-snug">
                    Users who completed registration, entered their email, or clicked through an initial signup CTA.
                  </div>
                )}
                <input
                  id="signups"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.signups}
                  onChange={(e) => handleNumberChange('signups', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-base font-mono font-semibold text-white focus:outline-none transition-colors ${
                    errors.signups
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-slate-700 focus:border-indigo-400'
                  }`}
                />
              </div>
              {errors.signups && (
                <p className="text-[11px] text-rose-400 mt-1.5">{errors.signups}</p>
              )}
              <span className="text-[11px] text-slate-400 mt-2 block">Account creation step</span>
            </div>

            {/* 3. Activated Users */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="activated" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Activated Users</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('activated')}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="What is Activated Users?"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeTooltip === 'activated' && (
                  <div className="p-2.5 mb-2 rounded-lg bg-amber-950/80 border border-amber-500/30 text-[11px] text-amber-200 leading-snug">
                    Users who completed the first core meaningful action or "Aha!" moment (e.g. exported their first resume, created first project).
                  </div>
                )}
                <input
                  id="activated"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.activated}
                  onChange={(e) => handleNumberChange('activated', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-base font-mono font-semibold text-white focus:outline-none transition-colors ${
                    errors.activated
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-slate-700 focus:border-amber-400'
                  }`}
                />
              </div>
              {errors.activated && (
                <p className="text-[11px] text-rose-400 mt-1.5">{errors.activated}</p>
              )}
              <span className="text-[11px] text-slate-400 mt-2 block">First core value milestone</span>
            </div>

            {/* 4. Returning Users */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="returning" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Returning Users</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('returning')}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="What is Returning Users?"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeTooltip === 'returning' && (
                  <div className="p-2.5 mb-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-[11px] text-emerald-200 leading-snug">
                    Users who returned to use the product in a subsequent session after their initial activation.
                  </div>
                )}
                <input
                  id="returning"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.returning}
                  onChange={(e) => handleNumberChange('returning', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-base font-mono font-semibold text-white focus:outline-none transition-colors ${
                    errors.returning
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-slate-700 focus:border-emerald-400'
                  }`}
                />
              </div>
              {errors.returning && (
                <p className="text-[11px] text-rose-400 mt-1.5">{errors.returning}</p>
              )}
              <span className="text-[11px] text-slate-400 mt-2 block">Habit & retention proxy</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer ring-1 ring-white/20 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Analyze My Startup</span>
          </button>
        </div>
      </form>
    </div>
  );
};
