export interface StartupInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  websiteUrl?: string;
  growthChallenge?: string;
  visitors: number;
  signups: number;
  activated: number;
  returning: number;
}

export type GrowthBottleneckStage = 
  | 'acquisition' 
  | 'activation' 
  | 'retention' 
  | 'cold_start' 
  | 'healthy';

export interface FunnelMetrics {
  visitors: number;
  signups: number;
  activated: number;
  returning: number;
  signupRate: number; // signups / visitors * 100
  activationRate: number; // activated / signups * 100
  retentionProxyRate: number; // returning / activated * 100
  visitorToSignupDropoff: number; // 100 - signupRate
  signupToActivationDropoff: number; // 100 - activationRate
  activationToRetentionDropoff: number; // 100 - retentionProxyRate
  isInsufficientData: boolean;
  isZeroTraffic: boolean;
  sampleSizeTier: 'none' | 'very_low' | 'moderate' | 'sufficient';
}

export interface GrowthDiagnosis {
  stage: GrowthBottleneckStage;
  stageName: string;
  headline: string;
  summary: string;
  severity: 'critical' | 'moderate' | 'healthy' | 'info';
  observedEvidence: string[];
  possibleCauses: string[];
  caveatsAndWarnings: string[];
  recommendedDiscovery: string;
  benchmarkContext: string;
}

export interface Experiment {
  id: string;
  title: string;
  stage: string;
  hypothesis: string;
  whyWorthTesting: string;
  executionSteps: [string, string, string];
  primarySuccessMetric: string;
  suggestedPeriod: string;
  expectedSignal: string;
  isAiGenerated?: boolean;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  input: StartupInput;
  metrics: FunnelMetrics;
  diagnosis: GrowthDiagnosis;
  experiments: [Experiment, Experiment];
  mode: 'rule_based' | 'nebius_enhanced';
}

export interface ValidationErrors {
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  visitors?: string;
  signups?: string;
  activated?: string;
  returning?: string;
  funnelRelational?: string;
}
