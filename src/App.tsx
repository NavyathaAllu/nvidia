import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StartupForm } from './components/StartupForm';
import { KpiCards } from './components/KpiCards';
import { FunnelVisualizer } from './components/FunnelVisualizer';
import { DiagnosisCard } from './components/DiagnosisCard';
import { ExperimentCards } from './components/ExperimentCards';
import { NebiusModal } from './components/NebiusModal';
import { ExportModal } from './components/ExportModal';
import { StartupInput, AnalysisResult } from './types/growth';
import {
  DEMO_STARTUP_DATA,
  analyzeStartupGrowth,
} from './engine/growthEngine';
import {
  loadSavedInput,
  saveInput,
  loadSavedAnalysis,
  saveAnalysis,
  clearSavedData,
} from './utils/storage';
import { downloadReportAsFile } from './utils/reportExporter';
import { Activity, ArrowUpRight, Github, Heart } from 'lucide-react';

export default function App() {
  const [currentInput, setCurrentInput] = useState<StartupInput>(() => loadSavedInput());
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() => loadSavedAnalysis());
  const [nebiusConfigured, setNebiusConfigured] = useState<boolean>(false);
  const [nebiusModel, setNebiusModel] = useState<string | null>(null);
  const [isNebiusModalOpen, setIsNebiusModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Check Nebius status on mount
  useEffect(() => {
    fetch('/api/nebius/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.configured) {
          setNebiusConfigured(true);
          setNebiusModel(data.model);
        }
      })
      .catch((_err) => {
        // Fallback silently to rule-based engine
        setNebiusConfigured(false);
      });
  }, []);

  const handleAnalyze = async (input: StartupInput) => {
    setIsAnalyzing(true);
    saveInput(input);
    setCurrentInput(input);

    // 1. Calculate deterministic baseline
    let result = analyzeStartupGrowth(input, nebiusConfigured ? 'nebius_enhanced' : 'rule_based');

    // 2. If Nebius is configured, attempt AI enhancement
    if (nebiusConfigured) {
      try {
        const resp = await fetch('/api/nebius/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input,
            metrics: result.metrics,
            diagnosis: result.diagnosis,
          }),
        });
        const data = await resp.json();
        if (data.success && Array.isArray(data.experiments) && data.experiments.length >= 2) {
          result = {
            ...result,
            experiments: [data.experiments[0], data.experiments[1]],
            mode: 'nebius_enhanced',
          };
        }
      } catch (err) {
        console.warn('Nebius AI request failed; continuing with deterministic diagnosis:', err);
      }
    }

    setAnalysisResult(result);
    saveAnalysis(result);
    setIsAnalyzing(false);

    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLoadDemo = () => {
    setCurrentInput(DEMO_STARTUP_DATA);
    const demoResult = analyzeStartupGrowth(DEMO_STARTUP_DATA, 'rule_based');
    setAnalysisResult(demoResult);
    saveInput(DEMO_STARTUP_DATA);
    saveAnalysis(demoResult);

    setTimeout(() => {
      document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    clearSavedData();
    setCurrentInput(DEMO_STARTUP_DATA);
    const defaultResult = analyzeStartupGrowth(DEMO_STARTUP_DATA, 'rule_based');
    setAnalysisResult(defaultResult);
  };

  const scrollToForm = () => {
    document.getElementById('startup-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090D1A] text-slate-100 flex flex-col font-sans">
      {/* Sticky Navigation */}
      <Navbar
        onLoadDemo={handleLoadDemo}
        onDownloadReport={() => setIsExportModalOpen(true)}
        onReset={handleReset}
        onOpenNebiusModal={() => setIsNebiusModalOpen(true)}
        nebiusConfigured={nebiusConfigured}
        hasAnalysis={Boolean(analysisResult)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onTryDemo={handleLoadDemo}
          onScrollToForm={scrollToForm}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
          {/* Section A: Startup Information & Funnel Input */}
          <StartupForm
            initialData={currentInput}
            onSubmit={handleAnalyze}
            onLoadDemo={handleLoadDemo}
            onReset={handleReset}
            isLoading={isAnalyzing}
          />

          {/* Section B & C: Growth Dashboard & Experiments */}
          {analysisResult && (
            <div id="dashboard-section" className="space-y-8 scroll-mt-20">
              {/* Dashboard Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Growth Diagnosis: {analysisResult.input.productName}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Audience: <strong className="text-slate-300">{analysisResult.input.targetAudience}</strong> • Mode: <span className="text-indigo-400 font-mono text-xs">{analysisResult.mode === 'nebius_enhanced' ? 'Nebius AI Enhanced' : 'Rule-Based Engine'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadReportAsFile(analysisResult)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                  >
                    Direct .md Download
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow transition-all cursor-pointer"
                  >
                    View Full Report
                  </button>
                </div>
              </div>

              {/* 1. 4 KPI Cards */}
              <KpiCards metrics={analysisResult.metrics} />

              {/* 2. Visual Funnel */}
              <FunnelVisualizer
                metrics={analysisResult.metrics}
                bottleneckStage={analysisResult.diagnosis.stage}
              />

              {/* 3. Deep Diagnosis Card */}
              <DiagnosisCard diagnosis={analysisResult.diagnosis} />

              {/* 4. Section C: Recommended Experiments */}
              <ExperimentCards
                experiments={analysisResult.experiments}
                bottleneckStage={analysisResult.diagnosis.stageName}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A14] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">LaunchPilot AI</span>
            <span>—</span>
            <span>"You built the product. Now find your users."</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Free Replit & Open Source Architecture</span>
            <span>•</span>
            <span>MIT License</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsNebiusModalOpen(true)}
              className="hover:text-indigo-400 underline transition-colors cursor-pointer"
            >
              Nebius / Model Specs
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NebiusModal
        isOpen={isNebiusModalOpen}
        onClose={() => setIsNebiusModalOpen(false)}
        configured={nebiusConfigured}
        model={nebiusModel}
      />

      {analysisResult && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          result={analysisResult}
        />
      )}
    </div>
  );
}
