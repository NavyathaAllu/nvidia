import { StartupInput, AnalysisResult } from '../types/growth';
import { DEMO_STARTUP_DATA, analyzeStartupGrowth } from '../engine/growthEngine';

const STORAGE_KEY_INPUT = 'launchpilot_startup_input_v1';
const STORAGE_KEY_ANALYSIS = 'launchpilot_latest_analysis_v1';

export function loadSavedInput(): StartupInput {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INPUT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.productName === 'string') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read saved input from localStorage:', err);
  }
  return DEMO_STARTUP_DATA;
}

export function saveInput(input: StartupInput): void {
  try {
    localStorage.setItem(STORAGE_KEY_INPUT, JSON.stringify(input));
  } catch (err) {
    console.warn('Could not save input to localStorage:', err);
  }
}

export function loadSavedAnalysis(): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANALYSIS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.metrics && parsed.diagnosis && parsed.experiments) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read saved analysis from localStorage:', err);
  }
  // If no saved analysis, initialize default from demo
  return analyzeStartupGrowth(DEMO_STARTUP_DATA);
}

export function saveAnalysis(analysis: AnalysisResult): void {
  try {
    localStorage.setItem(STORAGE_KEY_ANALYSIS, JSON.stringify(analysis));
  } catch (err) {
    console.warn('Could not save analysis to localStorage:', err);
  }
}

export function clearSavedData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_INPUT);
    localStorage.removeItem(STORAGE_KEY_ANALYSIS);
  } catch (err) {
    console.warn('Could not clear localStorage:', err);
  }
}
