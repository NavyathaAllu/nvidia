# LaunchPilot AI — Growth Doctor

> **"You built the product. Now find your users."**
> *Diagnosis before marketing: Fix the leaky bucket before buying more water.*

LaunchPilot AI is an evidence-first web application designed for early-stage startup founders. Rather than rushing to generate generic ad copy or social posts, LaunchPilot acts as a product growth doctor: it analyzes your conversion funnel, pinpoints the primary leak where users abandon your product, explains the evidence separately from hypotheses, and prescribes exactly two measurable experiments to fix it.

---

## The Problem

Most early-stage founders make one of two critical mistakes after shipping their MVP:
1. **Premature Promotion:** They spend money on ads or hours on social media marketing while their onboarding is broken—pouring expensive traffic into a leaky bucket.
2. **Analysis Paralysis:** Complex analytics platforms (Mixpanel, Amplitude, Google Analytics) overwhelm founders with hundreds of charts without answering the single question that matters: *"What is the main thing blocking my product from growing right now?"*

Other AI marketing tools generate copy and ad creatives without understanding whether the product has an acquisition problem, an onboarding problem, or a retention problem.

## The Solution

**LaunchPilot AI** provides diagnosis *before* marketing:
- **Zero-Dependency Core:** Works 100% offline with a transparent, rule-based growth engine. No API keys required.
- **Strict Funnel Validation:** Enforces natural funnel hierarchy ($Visitors \ge Signups \ge Activated \ge Returning \ge 0$).
- **Evidence vs. Hypotheses Separation:** Clearly distinguishes what the numbers prove from plausible psychological and product causes.
- **Two Focused Experiments:** Generates exactly two structured, testable experiments with hypotheses, 3 execution steps, success metrics, and observation windows.
- **1-Click Synthetic Demo:** Instant evaluation with realistic startup numbers (`ResumeSpark AI`).
- **Client-Side Report Export:** Download formatted Markdown diagnostic reports with zero external PDF dependencies.

---

## Target Users

- **Solo Founders & Hackathon Hackers:** Validate initial traction before investing more time or capital.
- **Bootstrapped Indie Hackers:** Determine whether their primary bottleneck is landing page clarity, onboarding friction, or retention.
- **Early-Stage Accelerators & Incubators:** Standardize diagnostic check-ins for batch startups.

---

## Main Features

1. **Startup Context & Funnel Ingestion:**
   - Collects product name, description, target audience, website, and growth challenge.
   - Captures 4 key conversion stages with clear definitions: Visitors, Signups, Activated Users, Returning Users.
2. **Growth Analytics Engine:**
   - Visitor-to-signup conversion rate & drop-off.
   - Signup-to-activation conversion rate & drop-off.
   - Retention proxy calculation (with clear caveats that it is a proxy ratio, not cohort retention).
   - Division-by-zero protection and small sample size warnings.
3. **Growth Diagnosis Engine:**
   - **Acquisition-to-Signup Friction:** Low visitor conversion (messaging mismatch, weak proof).
   - **Signup-to-Activation Friction:** Registrations abandon before first value (onboarding friction, delayed "Aha!" moment).
   - **Activation-to-Returning Friction:** Single-use utility, missing habit loops or re-engagement triggers.
   - **Traffic Cold Start:** Zero or insufficient visitor volume requiring unscalable founder outreach before conversion optimization.
4. **Actionable Experiment Generator:**
   - Prescribes exactly two experiments tailored to the diagnosed stage.
   - Includes 3 numbered execution steps, primary metric, suggested timeframe, and expected validation signal.
5. **1-Click Demo Mode:**
   - Pre-loaded with synthetic scenario **ResumeSpark AI** (1,000 visitors, 100 signups, 15 activated, 5 returning).
   - Highlights 10% signup rate, 15% activation rate, 33.33% retention proxy, and pinpoints the 85% activation drop-off.
6. **Report Export:**
   - 1-click Markdown download and clipboard copy.
7. **Optional Nebius Token Factory & NVIDIA Integration:**
   - Connects to NVIDIA Nemotron models via Nebius Token Factory's OpenAI-compatible API when credentials are provided.
   - When credentials are not present, runs transparently in Rule-Based Engine mode.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend:** Node.js, Express, tsx.
- **Persistence:** Browser `localStorage` (no database required).
- **Unit Testing:** Node.js native test runner (`node:test`, `node:assert/strict`).
- **Environment:** Free-tier friendly, zero mandatory external API subscriptions.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npx --yes tsx --test src/engine/growthEngine.test.ts

# 3. Start development server
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## How to Use Demo Mode

1. Open the application.
2. Click the **"Try Demo"** button in the navbar or hero section.
3. The application will instantly load the synthetic startup **ResumeSpark AI**:
   - Visitors: 1,000
   - Signups: 100 (10.0% conversion)
   - Activated: 15 (15.0% conversion, 85.0% drop-off)
   - Returning: 5 (33.33% retention proxy)
4. The dashboard immediately identifies **Signup-to-Activation Friction** as the primary bottleneck and prescribes:
   - *Experiment 1:* Interactive Zero-Setup First Draft Flow
   - *Experiment 2:* Interactive Value Preview Before Forced Registration
5. Click **"Export Report"** to view or download the complete diagnostic findings in Markdown.

---

## Configuring Optional Nebius / NVIDIA Credentials

LaunchPilot AI is designed to run 100% reliably without external keys. To enable optional AI-enhanced hypotheses using NVIDIA Nemotron via Nebius Token Factory:

1. Obtain an API key from [Nebius Token Factory](https://nebius.ai/).
2. Create or update your `.env` file:
   ```env
   NEBIUS_API_KEY="your-nebius-api-key"
   NEBIUS_MODEL="nvidia/nemotron-4-340b-instruct"
   ```
3. Restart the dev server (`npm run dev`).
4. The navbar badge will switch from **Rule Engine** to **Nebius / Nemotron (Active)**.

---

## 3-Minute Hackathon Demo Outline

- **0:00 - 0:40 (The Problem):** "Founders spend their limited time and budget on ads before knowing if their funnel holds water. Most AI marketing tools just write more tweets. LaunchPilot AI is a Growth Doctor: diagnosis before marketing."
- **0:40 - 1:20 (1-Click Demo):** Click "Try Demo". Point to ResumeSpark AI. "In one click, 1,000 visitors turn into 100 signups (healthy 10%), but only 15 users activate. 85% of people who signed up abandon before creating a resume."
- **1:20 - 2:00 (The Diagnosis & Experiments):** Scroll down to the Diagnosis Card. Show how factual evidence is separated from plausible causes. Show Experiment 1: 'Interactive Zero-Setup First Draft Flow' and Experiment 2: 'Interactive Value Preview Before Setup'.
- **2:00 - 2:30 (Validation & Custom Input):** Demonstrate custom input validation: change signups to exceed visitors, show friendly validation message. Then enter realistic data and re-run.
- **2:30 - 3:00 (Export & Architecture):** Click "Export Report", download the Markdown file. Highlight that the entire application runs free on Replit without requiring paid API keys, with optional Nebius Token Factory integration ready.

---

## Current Limitations

- Funnel stages are currently linear (Visitors $\to$ Signups $\to$ Activated $\to$ Returning). Non-linear or multi-product funnels require separate analyses.
- The retention metric is a proxy ratio ($returning / activated$) based on sample period activity, not a longitudinal cohort matrix.

## Future Roadmap

- Longitudinal cohort retention matrix upload (CSV import).
- Direct integrations with PostHog, Plausible, and Google Analytics 4.
- Automated experiment tracking dashboard to log weekly experiment results.

---

## License

This project is licensed under the [MIT License](LICENSE).
