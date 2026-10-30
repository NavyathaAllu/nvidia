import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route to check Nebius / NVIDIA configuration status
app.get('/api/nebius/status', (_req, res) => {
  const apiKey = process.env.NEBIUS_API_KEY;
  const model = process.env.NEBIUS_MODEL || 'nvidia/nemotron-4-340b-instruct';
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== 'MY_NEBIUS_API_KEY');

  res.json({
    configured: isConfigured,
    model: isConfigured ? model : null,
    provider: 'Nebius Token Factory / NVIDIA Open-Source Model',
    fallbackActive: !isConfigured,
    message: isConfigured
      ? `Nebius API connected (${model})`
      : 'Rule-based analysis engine active. To enable NVIDIA Nemotron via Nebius, configure NEBIUS_API_KEY.',
  });
});

// Optional Nebius / NVIDIA enhancement endpoint
app.post('/api/nebius/enhance', async (req, res) => {
  const apiKey = process.env.NEBIUS_API_KEY;
  const model = process.env.NEBIUS_MODEL || 'nvidia/nemotron-4-340b-instruct';

  if (!apiKey || apiKey.trim().length === 0 || apiKey === 'MY_NEBIUS_API_KEY') {
    return res.status(200).json({
      success: false,
      configured: false,
      message: 'Nebius credentials not configured. Using deterministic growth engine.',
    });
  }

  const { input, metrics, diagnosis } = req.body;

  try {
    const prompt = `You are LaunchPilot AI Growth Doctor.
Startup Name: ${input.productName}
Description: ${input.productDescription}
Target Audience: ${input.targetAudience}
Funnel Metrics:
- Visitors: ${metrics.visitors}
- Signups: ${metrics.signups} (${metrics.signupRate}% conversion)
- Activated: ${metrics.activated} (${metrics.activationRate}% conversion, ${metrics.signupToActivationDropoff}% dropoff)
- Returning: ${metrics.returning} (${metrics.retentionProxyRate}% retention proxy)

Diagnosed Bottleneck: ${diagnosis.stageName} (${diagnosis.headline})

Generate exactly 2 high-impact, measurable, evidence-aware experiments.
Respond in strict JSON with an array named "experiments" containing 2 objects, each with:
"title", "stage", "hypothesis", "whyWorthTesting", "executionSteps" (array of 3 strings), "primarySuccessMetric", "suggestedPeriod", "expectedSignal".`;

    const nebiusResponse = await fetch('https://api.tokenfactory.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an elite startup growth diagnostic engine. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!nebiusResponse.ok) {
      const errText = await nebiusResponse.text();
      console.warn('Nebius API error:', errText);
      return res.status(200).json({
        success: false,
        configured: true,
        message: `Nebius API request returned ${nebiusResponse.status}. Falling back to deterministic engine.`,
      });
    }

    const data = await nebiusResponse.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return res.json({
      success: true,
      configured: true,
      model,
      experiments: parsed.experiments || parsed,
    });
  } catch (err: any) {
    console.error('Nebius call error:', err);
    return res.status(200).json({
      success: false,
      configured: true,
      message: err.message || 'Error communicating with Nebius Token Factory. Using rule-based engine.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LaunchPilot AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
