import {
  StartupInput,
  FunnelMetrics,
  GrowthDiagnosis,
  Experiment,
  AnalysisResult,
  ValidationErrors,
  GrowthBottleneckStage,
} from '../types/growth';

/**
 * Validates startup inputs and funnel numbers.
 * Enforces: visitors >= signups >= activated >= returning >= 0
 * Non-negative integers only.
 */
export function validateStartupInput(input: Partial<StartupInput>): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  if (!input.productName || !input.productName.trim()) {
    errors.productName = 'Product name is required.';
  }

  if (!input.productDescription || !input.productDescription.trim()) {
    errors.productDescription = 'Product description is required to contextualize growth.';
  }

  if (!input.targetAudience || !input.targetAudience.trim()) {
    errors.targetAudience = 'Target audience is required.';
  }

  const v = input.visitors;
  const s = input.signups;
  const a = input.activated;
  const r = input.returning;

  // Validate each field is defined, an integer, and >= 0
  const checkNonNegativeInt = (val: number | undefined, name: string): string | null => {
    if (val === undefined || val === null || isNaN(val)) {
      return `${name} is required.`;
    }
    if (!Number.isInteger(val)) {
      return `${name} must be a whole number (integer).`;
    }
    if (val < 0) {
      return `${name} cannot be negative.`;
    }
    return null;
  };

  const vErr = checkNonNegativeInt(v, 'Visitors');
  if (vErr) errors.visitors = vErr;

  const sErr = checkNonNegativeInt(s, 'Signups');
  if (sErr) errors.signups = sErr;

  const aErr = checkNonNegativeInt(a, 'Activated users');
  if (aErr) errors.activated = aErr;

  const rErr = checkNonNegativeInt(r, 'Returning users');
  if (rErr) errors.returning = rErr;

  // Relational validation if individual numbers are valid
  if (!errors.visitors && !errors.signups && !errors.activated && !errors.returning) {
    const visitors = v as number;
    const signups = s as number;
    const activated = a as number;
    const returning = r as number;

    if (signups > visitors) {
      errors.signups = `Signups (${signups}) cannot exceed Total Visitors (${visitors}).`;
      errors.funnelRelational = 'Funnel hierarchy violation: Visitors must be greater than or equal to Signups.';
    } else if (activated > signups) {
      errors.activated = `Activated users (${activated}) cannot exceed Signups (${signups}).`;
      errors.funnelRelational = 'Funnel hierarchy violation: Signups must be greater than or equal to Activated users.';
    } else if (returning > activated) {
      errors.returning = `Returning users (${returning}) cannot exceed Activated users (${activated}).`;
      errors.funnelRelational = 'Funnel hierarchy violation: Activated users must be greater than or equal to Returning users.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates all conversion rates and drop-offs deterministically.
 * Handles division by zero safely.
 */
export function calculateFunnelMetrics(
  visitors: number,
  signups: number,
  activated: number,
  returning: number
): FunnelMetrics {
  const safeDiv = (num: number, den: number): number => {
    if (den <= 0 || isNaN(den) || isNaN(num)) return 0;
    const res = (num / den) * 100;
    return Math.round(res * 100) / 100; // Round to 2 decimal places
  };

  const isZeroTraffic = visitors === 0;
  const isInsufficientData = visitors > 0 && visitors < 20;

  let sampleSizeTier: FunnelMetrics['sampleSizeTier'] = 'sufficient';
  if (isZeroTraffic) {
    sampleSizeTier = 'none';
  } else if (visitors < 50 || signups < 5) {
    sampleSizeTier = 'very_low';
  } else if (visitors < 200 || signups < 20) {
    sampleSizeTier = 'moderate';
  }

  const signupRate = safeDiv(signups, visitors);
  const activationRate = safeDiv(activated, signups);
  const retentionProxyRate = safeDiv(returning, activated);

  const visitorToSignupDropoff = isZeroTraffic ? 0 : Math.round((100 - signupRate) * 100) / 100;
  const signupToActivationDropoff = signups === 0 ? 0 : Math.round((100 - activationRate) * 100) / 100;
  const activationToRetentionDropoff = activated === 0 ? 0 : Math.round((100 - retentionProxyRate) * 100) / 100;

  return {
    visitors,
    signups,
    activated,
    returning,
    signupRate,
    activationRate,
    retentionProxyRate,
    visitorToSignupDropoff,
    signupToActivationDropoff,
    activationToRetentionDropoff,
    isInsufficientData,
    isZeroTraffic,
    sampleSizeTier,
  };
}

/**
 * Evaluates the bottleneck stage using transparent business rules and benchmark context.
 */
export function diagnoseFunnel(
  input: StartupInput,
  metrics: FunnelMetrics
): GrowthDiagnosis {
  if (metrics.isZeroTraffic) {
    return {
      stage: 'cold_start',
      stageName: 'Initial Acquisition / Traffic Cold Start',
      headline: 'Zero visitors detected — Funnel optimization is premature',
      summary: 'Before analyzing conversion rates, the immediate priority is driving the first 50 to 100 targeted visitors to the product.',
      severity: 'info',
      observedEvidence: [
        'Total visitors is currently 0.',
        'Calculated conversion rates cannot produce statistically valid diagnostics without inbound traffic.',
      ],
      possibleCauses: [
        'Product has not yet been distributed to active communities or channels where target users hang out.',
        'No direct founder outreach or distribution experiment has been initiated.',
        'Landing page or launch announcement has not been published publicly.',
      ],
      caveatsAndWarnings: [
        'Do not spend time tweaking onboarding or UI details until real humans are visiting the site.',
      ],
      recommendedDiscovery: 'Do 10 direct, unscalable founder reach-outs to ideal customers in your target audience to get initial eyes and immediate qualitative feedback.',
      benchmarkContext: 'Early-stage benchmark: Aim for an initial batch of 50-100 high-intent visitors before evaluating conversion metrics.',
    };
  }

  if (metrics.isInsufficientData) {
    return {
      stage: 'cold_start',
      stageName: 'Sample Size Too Low',
      headline: 'Insufficient visitor volume for statistical reliability',
      summary: `You have recorded ${metrics.visitors} visitor(s). At this volume, individual user actions swing conversion percentages by double digits.`,
      severity: 'info',
      observedEvidence: [
        `Sample volume: ${metrics.visitors} visitors, ${metrics.signups} signups.`,
        'Small absolute numbers cannot reliably isolate product flaws from sample variance.',
      ],
      possibleCauses: [
        'Distribution is still in initial exploratory phase.',
        'Early test links shared only with friends or immediate contacts.',
      ],
      caveatsAndWarnings: [
        'Warning: Any diagnosis at this volume is directional, not statistically conclusive.',
      ],
      recommendedDiscovery: 'Focus on manual customer discovery conversations rather than quantitative funnel metrics until you reach at least 100 visitors.',
      benchmarkContext: 'Early-stage benchmark: Funnel analysis becomes directionally actionable above 100-200 visitors.',
    };
  }

  // Diagnostic logic based on comparative health & industry baselines:
  // Typical SaaS baselines:
  // Visitor -> Signup: 5% - 15% (Healthy: ~8-12%)
  // Signup -> Activation: 25% - 50% (Healthy: ~30-40%)
  // Retention Proxy: 25% - 45% (Healthy: ~30%+)

  // Check where the steepest unexpected drop occurs relative to stage expectation:
  // We evaluate relative friction score:
  // Normalized deficit = (Expected Baseline - Actual Rate) / Expected Baseline
  const acquisitionDeficit = Math.max(0, (10 - metrics.signupRate) / 10);
  const activationDeficit = Math.max(0, (30 - metrics.activationRate) / 30);
  const retentionDeficit = Math.max(0, (35 - metrics.retentionProxyRate) / 35);

  let stage: GrowthBottleneckStage = 'activation';

  // Determine stage by identifying the most critical breakdown
  if (metrics.signups > 0 && metrics.activationRate <= 20 && activationDeficit >= acquisitionDeficit && activationDeficit >= retentionDeficit) {
    stage = 'activation';
  } else if (metrics.signupRate < 4 && acquisitionDeficit >= activationDeficit) {
    stage = 'acquisition';
  } else if (metrics.activated > 0 && metrics.retentionProxyRate < 20 && retentionDeficit >= activationDeficit) {
    stage = 'retention';
  } else {
    // Fallback: pick the highest deficit
    if (activationDeficit >= acquisitionDeficit && activationDeficit >= retentionDeficit) {
      stage = 'activation';
    } else if (acquisitionDeficit > activationDeficit && acquisitionDeficit > retentionDeficit) {
      stage = 'acquisition';
    } else if (retentionDeficit > 0.4) {
      stage = 'retention';
    } else {
      stage = 'healthy';
    }
  }

  // Build tailored diagnosis
  if (stage === 'activation') {
    return {
      stage: 'activation',
      stageName: 'Signup-to-Activation Friction',
      headline: `Severe drop-off between signup and first value (${metrics.signupToActivationDropoff}% drop-off)`,
      summary: `While your top-of-funnel conversion is functioning (${metrics.signupRate}% signup rate), ${metrics.signupToActivationDropoff}% of users who registered never reached your core activation milestone.`,
      severity: 'critical',
      observedEvidence: [
        `Out of ${metrics.signups} registered users, only ${metrics.activated} completed the key activation action (${metrics.activationRate}% activation rate).`,
        `${metrics.signups - metrics.activated} users abandoned the application during or immediately after the signup process.`,
        `The drop-off at this step (${metrics.signupToActivationDropoff}%) represents the largest leak in your product engine.`,
      ],
      possibleCauses: [
        'High onboarding cognitive friction: Too many setup questions, forms, or permissions requested before showing the product.',
        'Delayed "Aha!" moment: The time-to-first-value is too long; users lose momentum before experiencing core benefits.',
        'Expectation gap: What was promised on the landing page is not immediately visible or accessible upon logging in.',
        'Blank canvas syndrome: The empty state after first login is intimidating without pre-filled templates or guided prompts.',
      ],
      caveatsAndWarnings: [
        'Notice: The lowest stage conversion rate is a diagnostic signal, not proof of the root cause.',
        'This metric only reflects user actions captured by your defined activation event. Ensure your tracking accurately defines the real first-value moment.',
        metrics.sampleSizeTier === 'very_low' || metrics.sampleSizeTier === 'moderate'
          ? `Sample size warning: Based on ${metrics.signups} signups. Trends should be verified with qualitative user interviews.`
          : 'Sufficient sample size to confirm a real onboarding bottleneck.',
      ],
      recommendedDiscovery: 'Watch 5 recorded user onboarding sessions (or conduct live over-the-shoulder tests with target users). Identify the exact screen where users pause, hesitate, or exit.',
      benchmarkContext: 'Industry Benchmark: Top-quartile product-led SaaS products typically achieve 30% to 50% signup-to-activation. At 15%, 85 out of 100 signed-up users are lost before experiencing real utility.',
    };
  }

  if (stage === 'acquisition') {
    return {
      stage: 'acquisition',
      stageName: 'Acquisition-to-Signup Friction',
      headline: `Low visitor conversion at the top of the funnel (${metrics.signupRate}% signup rate)`,
      summary: `Visitors are arriving at your landing page (${metrics.visitors} total), but relatively few decide to register (${metrics.visitorToSignupDropoff}% bounce or leave without signing up).`,
      severity: 'critical',
      observedEvidence: [
        `Only ${metrics.signups} out of ${metrics.visitors} visitors converted into signups (${metrics.signupRate}% conversion rate).`,
        `${metrics.visitors - metrics.signups} visitors left without initiating an account or registration.`,
      ],
      possibleCauses: [
        'Unclear value proposition: The above-the-fold headline fails to answer "What is this?" and "Why does it matter to me?" within 5 seconds.',
        'Audience-traffic mismatch: Inbound traffic is arriving from sources that do not represent your core ICP (Ideal Customer Profile).',
        'Weak trust and credibility signals: Lack of tangible product screenshots, social proof, testimonials, or transparent explanations.',
        'Too much friction at registration: Asking for credit cards, phone numbers, or unnecessary personal details upfront.',
      ],
      caveatsAndWarnings: [
        'Conversion rates vary heavily by traffic source (organic search vs. social ads vs. direct recommendations). Analyze traffic source quality before redesigning everything.',
        'Warning: Low visitor conversion is a signal to sharpen messaging and targeting, not an excuse to spend more money on ad clicks.',
      ],
      recommendedDiscovery: 'Conduct 5 five-second landing page clarity tests with people in your target audience: ask them what the product does and who it is for after viewing your hero section for 5 seconds.',
      benchmarkContext: 'Industry Benchmark: SaaS landing pages converting qualified traffic generally range between 7% and 15%. Rates below 4% indicate significant messaging friction or unqualified traffic.',
    };
  }

  if (stage === 'retention') {
    return {
      stage: 'retention',
      stageName: 'Activation-to-Returning-User Friction',
      headline: `Users experience initial value but do not form a recurring habit (${metrics.activationToRetentionDropoff}% drop-off)`,
      summary: `Your users are reaching activation (${metrics.activationRate}% activation rate), but only ${metrics.retentionProxyRate}% return after their initial experience.`,
      severity: 'critical',
      observedEvidence: [
        `Out of ${metrics.activated} activated users, only ${metrics.returning} returned to the product (${metrics.retentionProxyRate}% retention proxy).`,
        `${metrics.activated - metrics.returning} users abandoned the product after completing their first meaningful interaction.`,
      ],
      possibleCauses: [
        'Single-use utility: The product solves an episodic one-off problem without a recurring reason to re-engage.',
        'Absence of re-engagement triggers: No timely notifications, digest emails, or external reminders bringing users back when new value is ready.',
        'Lack of data accumulation / switching costs: The product does not become more valuable the more the user uses it (no saved workflows, accumulated insights, or network effects).',
        'Incomplete core workflow: The first session provided novelty, but the ongoing workflow is too cumbersome to replace existing habits.',
      ],
      caveatsAndWarnings: [
        'Cohort clarification: This retention proxy reflects returning users divided by activated users in the period, NOT a true cohort retention curve over 30 or 90 days.',
        'Early-stage retention metrics require examining the natural frequency of the user problem (daily, weekly, monthly, or seasonal).',
      ],
      recommendedDiscovery: 'Send a personal email from the founder to 10 churned users asking: "What were you hoping LaunchPilot/your product would do that it didn\'t do?" Offer a 15-minute call in exchange for a small gift or founder gratitude.',
      benchmarkContext: 'Industry Benchmark: Healthy B2B/Prosumer products see 30%+ of activated users returning within their natural usage cycle. Rates below 20% suggest weak product-market fit or absence of retention hooks.',
    };
  }

  // Healthy stage
  return {
    stage: 'healthy',
    stageName: 'Balanced Growth Funnel',
    headline: 'Consistent conversion across all funnel stages',
    summary: 'Your funnel metrics show healthy progression from visitor to returning user without an outsized drop-off at any single step.',
    severity: 'healthy',
    observedEvidence: [
      `Visitor-to-signup: ${metrics.signupRate}% (healthy).`,
      `Signup-to-activation: ${metrics.activationRate}% (healthy).`,
      `Activation-to-returning: ${metrics.retentionProxyRate}% (healthy proxy).`,
    ],
    possibleCauses: [
      'Strong product-market alignment with current audience.',
      'Clear, frictionless onboarding that delivers on the landing page promise.',
    ],
    caveatsAndWarnings: [
      'Keep monitoring as you scale traffic; conversion rates often decline as you expand beyond early enthusiastic adopters.',
    ],
    recommendedDiscovery: 'Double down on the top acquisition channel driving your most engaged returning users.',
    benchmarkContext: 'Healthy baseline across all three steps.',
  };
}

/**
 * Generates exactly TWO specific, measurable experiments based on the diagnosed stage.
 */
export function generateExperiments(
  input: StartupInput,
  metrics: FunnelMetrics,
  diagnosis: GrowthDiagnosis
): [Experiment, Experiment] {
  const pName = input.productName || 'Your Product';
  const audience = input.targetAudience || 'target users';

  if (diagnosis.stage === 'activation') {
    // Stage B: Signup-to-activation friction
    // Specifically tailored to the product description / demo scenario
    const isResumeOrDocument = /resume|cv|portfolio|document|writer/i.test(
      `${input.productName} ${input.productDescription}`
    );

    if (isResumeOrDocument) {
      return [
        {
          id: 'exp-act-1',
          title: 'Interactive Zero-Setup First Draft Flow',
          stage: 'Signup-to-Activation',
          hypothesis: `If ${audience} can generate or import their first draft in under 60 seconds without mandatory profile questionnaires, activation will increase by eliminating upfront cognitive load.`,
          whyWorthTesting: `Currently, ${metrics.signupToActivationDropoff}% of signups abandon before activation. Shortening time-to-first-value directly addresses the primary drop-off.`,
          executionSteps: [
            'Replace the multi-step intake questionnaire with a one-click "Upload existing document or pick a 1-minute template" screen.',
            'Display an interactive preview immediately after upload with pre-highlighted improvements.',
            'Save user profile preferences silently in the background rather than forcing upfront configuration.',
          ],
          primarySuccessMetric: `Signup-to-Activation Rate (Target: lift from ${metrics.activationRate}% to 30%+)`,
          suggestedPeriod: '14 days (or minimum 100 new signups)',
          expectedSignal: 'A 40%+ relative improvement in users reaching the generated output milestone within their first session.',
        },
        {
          id: 'exp-act-2',
          title: 'Interactive Value Preview Before Forced Registration',
          stage: 'Signup-to-Activation',
          hypothesis: `If prospective ${audience} can see AI feedback or draft scoring on their own input BEFORE completing account creation, they will be primed and committed to complete activation immediately.`,
          whyWorthTesting: 'Users who experience tangible utility before authentication have much higher intent and understand the reward waiting for them.',
          executionSteps: [
            'Create a "Try without signup" sandbox on the landing page allowing users to paste a snippet or bullet point.',
            'Show instant AI analysis with 2 free actionable improvements and a blurred "full report".',
            'Prompt account creation only when clicking "Unlock full tailored draft & export".',
          ],
          primarySuccessMetric: 'First-session document completion rate among newly registered accounts',
          suggestedPeriod: '14 days across next cohort',
          expectedSignal: 'Activation rate of users coming through the sandbox exceeds 35%, with lower drop-off during onboarding.',
        },
      ];
    }

    return [
      {
        id: 'exp-act-gen-1',
        title: 'Streamlined One-Click "First Value" Guided Tour',
        stage: 'Signup-to-Activation',
        hypothesis: `If newly registered ${audience} are dropped directly into a pre-populated sandbox with an interactive 3-step checklist, they will complete their first core action faster with less confusion.`,
        whyWorthTesting: `${metrics.signupToActivationDropoff}% of users register but abandon before completing activation. An empty dashboard creates decision paralysis.`,
        executionSteps: [
          'Audit and remove all optional profile setup fields from the post-registration flow.',
          'Provide sample demo data pre-loaded into the workspace so the screen is never blank.',
          'Add an unobtrusive progress indicator (e.g. "Step 1 of 3: Run your first calculation") with an immediate confetti / confirmation moment.',
        ],
        primarySuccessMetric: `Signup-to-Activation Conversion (Target: lift from ${metrics.activationRate}% to 25%+)`,
        suggestedPeriod: '14 days (or 75 new signups)',
        expectedSignal: 'Activation rate increases by at least 10 percentage points and median time-to-first-action drops by 50%.',
      },
      {
        id: 'exp-act-gen-2',
        title: 'Reverse Onboarding: Deliver Value Before Friction',
        stage: 'Signup-to-Activation',
        hypothesis: `If ${audience} can test the core utility of ${pName} before having to configure settings, verify emails, or invite teammates, activation completion will surge.`,
        whyWorthTesting: 'Forcing administrative tasks before showing product magic causes instant churn among busy founders and users.',
        executionSteps: [
          'Defer email verification and team invites until AFTER the user saves their first successful work item.',
          'Add a "Quick Start Template" button on the first post-login screen that generates a completed sample in 1 click.',
          'Implement an auto-save mechanism so users do not fear losing work if they explore.',
        ],
        primarySuccessMetric: 'Percentage of signups completing the core workflow in session 1',
        suggestedPeriod: '10 to 14 days',
        expectedSignal: 'Significant reduction in same-day drop-off and higher activation velocity.',
      },
    ];
  }

  if (diagnosis.stage === 'acquisition') {
    // Stage A: Acquisition-to-signup friction
    return [
      {
        id: 'exp-acq-1',
        title: 'Outcome-Oriented Headline & Above-the-Fold Proof Test',
        stage: 'Acquisition-to-Signup',
        hypothesis: `If the landing page headline for ${pName} clearly states the specific end benefit for ${audience} accompanied by an authentic product screenshot, visitor-to-signup conversion will increase.`,
        whyWorthTesting: `Currently, ${metrics.visitorToSignupDropoff}% of visitors leave without signing up (${metrics.signupRate}% conversion). Clear messaging is the highest-leverage lever.`,
        executionSteps: [
          'Rewrite the hero H1 from feature-focused ("An AI tool for...") to outcome-focused ("Get [Desired Result] in [Timeframe] without [Pain]").',
          'Add a crisp, unembellished screenshot or 10-second looping preview of the core product interface directly below the headline.',
          'Add 2 specific credibility anchors (e.g., student outcome quotes or concrete metrics).',
        ],
        primarySuccessMetric: `Visitor-to-Signup Rate (Target: lift from ${metrics.signupRate}% to 8%+)`,
        suggestedPeriod: '14 days (or 300+ visitors)',
        expectedSignal: 'At least a 30% relative lift in click-through on the primary CTA button.',
      },
      {
        id: 'exp-acq-2',
        title: 'Frictionless Single-Click Social or Passwordless Signup',
        stage: 'Acquisition-to-Signup',
        hypothesis: `If ${audience} can begin using ${pName} using a 1-click Google sign-in or a simple single-input email field, signup friction will drop significantly.`,
        whyWorthTesting: 'Lengthy registration forms with password confirmation and redundant fields deter impulse trials.',
        executionSteps: [
          'Reduce the signup form to an email input and single CTA button, or 1-click Google Authentication.',
          'Remove upfront password requirements by utilizing magic links or deferred password setting.',
          'Clarify that no credit card or commitment is required right next to the submit button.',
        ],
        primarySuccessMetric: 'Landing page CTA conversion rate',
        suggestedPeriod: '14 days',
        expectedSignal: 'Signup conversion rate increases by 20% to 40% with zero increase in advertising spend.',
      },
    ];
  }

  if (diagnosis.stage === 'retention') {
    // Stage C: Activation-to-returning-user friction
    return [
      {
        id: 'exp-ret-1',
        title: 'Event-Driven "Value Ready" Re-engagement Triggers',
        stage: 'Activation-to-Returning',
        hypothesis: `If activated ${audience} receive a personalized notification or email with new actionable insights 48 hours after their first session, returning user retention will improve.`,
        whyWorthTesting: `While users activate, ${metrics.activationToRetentionDropoff}% do not return. External triggers bridge the gap while the habit is forming.`,
        executionSteps: [
          'Identify a natural recurring trigger in ${pName} (e.g. weekly progress, new match, or smart reminder).',
          'Automate a clean, text-based email from the founder sent at Day 2 and Day 5 highlighting one specific next action.',
          'Include a direct deep-link that bypasses general navigation straight into the user\'s saved project.',
        ],
        primarySuccessMetric: `Returning User Rate (Target: lift from ${metrics.retentionProxyRate}% to 45%+)`,
        suggestedPeriod: '21 days to track multi-week return behavior',
        expectedSignal: 'A 25%+ increase in day-7 and day-14 returning session counts.',
      },
      {
        id: 'exp-ret-2',
        title: 'Founder Feedback Calls & "Missing Habit" Diagnostic',
        stage: 'Activation-to-Returning',
        hypothesis: `If we conduct 10 direct 15-minute interviews with users who activated but did not return, we will discover the missing workflow loop necessary to build recurring utility.`,
        whyWorthTesting: 'Retention failures usually indicate the product solved a one-time pain rather than an ongoing need. Qualitative feedback reveals what to build next.',
        executionSteps: [
          'Filter activated users who haven\'t logged in for 7 days.',
          'Send a short, genuine email: "Hey [Name], saw you tried ${pName}. Did it actually help with [problem]? Would love 10 minutes to learn what we missed."',
          'Synthesize common reasons (e.g. "forgot about it", "got what I needed and won\'t need it for 6 months", "missing feature X").',
        ],
        primarySuccessMetric: 'Identification of 2 validated recurring use-case features to build',
        suggestedPeriod: '7 to 10 days',
        expectedSignal: 'At least 5 completed founder conversations revealing specific recurring workflow blockers.',
      },
    ];
  }

  // Cold start experiments
  return [
    {
      id: 'exp-cold-1',
      title: 'Direct Founder 1-on-1 Concierge Outreach',
      stage: 'Initial Traffic',
      hypothesis: `If the founder directly reaches out to 25 target ${audience} via LinkedIn, Twitter/X, or campus communities with a personalized offer to solve their problem manually, we will secure our first 20 qualified users.`,
      whyWorthTesting: 'Doing things that do not scale is the only reliable way to kickstart an early-stage product engine.',
      executionSteps: [
        'List 3 online communities or groups where your exact target audience actively asks questions.',
        'Reach out individually offering free personalized assistance or a tailored draft using ${pName}.',
        'Personally observe how they interact with the product and record their verbatim reactions.',
      ],
      primarySuccessMetric: 'First 25 qualified visitors and 10 engaged users',
      suggestedPeriod: '7 days',
      expectedSignal: 'Initial baseline cohort established with direct founder feedback channels open.',
    },
    {
      id: 'exp-cold-2',
      title: 'High-Value Free Tool or Template Drop in Target Community',
      stage: 'Initial Traffic',
      hypothesis: `If we release a high-value free resource or checklist solving an immediate headache for ${audience}, it will drive initial organic traffic to ${pName}.`,
      whyWorthTesting: 'Educational and practical resources generate goodwill and qualified inbound interest at zero ad spend.',
      executionSteps: [
        'Package a key insight or checklist from ${pName} into a free public Notion doc or quick interactive guide.',
        'Post it as a helpful resource in relevant subreddits, Discord servers, or student groups without aggressive sales pitches.',
        'Include a subtle link back to ${pName} for automated execution.',
      ],
      primarySuccessMetric: 'Initial 100 landing page visits from qualified community members',
      suggestedPeriod: '7 to 10 days',
      expectedSignal: 'Steady inbound stream of target visitors with high contextual intent.',
    },
  ];
}

/**
 * Standard synthetic demo scenario per spec Section 9:
 * Product: ResumeSpark AI
 * Description: An AI resume builder for students applying for internships.
 * Target audience: College students and recent graduates.
 * Visitors: 1000, Signups: 100, Activated: 15, Returning: 5
 */
export const DEMO_STARTUP_DATA: StartupInput = {
  productName: 'ResumeSpark AI',
  productDescription: 'An AI resume builder for students applying for internships.',
  targetAudience: 'College students and recent graduates',
  websiteUrl: 'https://resumespark.example.com',
  growthChallenge: 'High traffic from Reddit and TikTok, but very few students end up generating an exportable resume.',
  visitors: 1000,
  signups: 100,
  activated: 15,
  returning: 5,
};

/**
 * Runs the complete deterministic growth analysis.
 */
export function analyzeStartupGrowth(
  input: StartupInput,
  mode: 'rule_based' | 'nebius_enhanced' = 'rule_based'
): AnalysisResult {
  const metrics = calculateFunnelMetrics(
    input.visitors,
    input.signups,
    input.activated,
    input.returning
  );

  const diagnosis = diagnoseFunnel(input, metrics);
  const experiments = generateExperiments(input, metrics, diagnosis);

  return {
    id: `lp-analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    input,
    metrics,
    diagnosis,
    experiments,
    mode,
  };
}
