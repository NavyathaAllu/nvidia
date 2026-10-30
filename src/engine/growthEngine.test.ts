import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFunnelMetrics,
  diagnoseFunnel,
  generateExperiments,
  analyzeStartupGrowth,
  validateStartupInput,
  DEMO_STARTUP_DATA,
} from './growthEngine.ts';

test('Funnel metrics calculations - Demo scenario (ResumeSpark AI)', () => {
  // Visitors: 1000, Signups: 100, Activated: 15, Returning: 5
  const metrics = calculateFunnelMetrics(1000, 100, 15, 5);

  // Expected:
  // Visitor-to-signup: 100 / 1000 * 100 = 10%
  // Signup-to-activation: 15 / 100 * 100 = 15%
  // Activation-to-returning: 5 / 15 * 100 = 33.33%
  assert.equal(metrics.signupRate, 10);
  assert.equal(metrics.activationRate, 15);
  assert.equal(metrics.retentionProxyRate, 33.33);

  // Drop-offs:
  assert.equal(metrics.visitorToSignupDropoff, 90);
  assert.equal(metrics.signupToActivationDropoff, 85);
  assert.equal(metrics.activationToRetentionDropoff, 66.67);
  assert.equal(metrics.isZeroTraffic, false);
  assert.equal(metrics.isInsufficientData, false);
});

test('Diagnostic focus on Demo scenario identifies Signup-to-activation friction', () => {
  const result = analyzeStartupGrowth(DEMO_STARTUP_DATA);

  assert.equal(result.metrics.signupRate, 10);
  assert.equal(result.metrics.activationRate, 15);
  assert.equal(result.metrics.retentionProxyRate, 33.33);

  // Expected bottleneck: Signup-to-activation friction
  assert.equal(result.diagnosis.stage, 'activation');
  assert.match(result.diagnosis.stageName, /Activation/i);
  assert.match(result.diagnosis.headline, /85% drop-off/i);

  // Exactly two experiments generated
  assert.equal(result.experiments.length, 2);
  assert.ok(result.experiments[0].title.length > 5);
  assert.ok(result.experiments[1].title.length > 5);
  assert.equal(result.experiments[0].executionSteps.length, 3);
  assert.equal(result.experiments[1].executionSteps.length, 3);
});

test('Validation checks enforce visitors >= signups >= activated >= returning >= 0', () => {
  // 1. Invalid: signups > visitors
  const res1 = validateStartupInput({
    ...DEMO_STARTUP_DATA,
    visitors: 100,
    signups: 200,
  });
  assert.equal(res1.isValid, false);
  assert.ok(res1.errors.signups);

  // 2. Invalid: activated > signups
  const res2 = validateStartupInput({
    ...DEMO_STARTUP_DATA,
    signups: 50,
    activated: 60,
  });
  assert.equal(res2.isValid, false);
  assert.ok(res2.errors.activated);

  // 3. Invalid: returning > activated
  const res3 = validateStartupInput({
    ...DEMO_STARTUP_DATA,
    activated: 10,
    returning: 12,
  });
  assert.equal(res3.isValid, false);
  assert.ok(res3.errors.returning);

  // 4. Invalid: negative number
  const res4 = validateStartupInput({
    ...DEMO_STARTUP_DATA,
    visitors: -5,
  });
  assert.equal(res4.isValid, false);
  assert.ok(res4.errors.visitors);

  // 5. Invalid: non-integer
  const res5 = validateStartupInput({
    ...DEMO_STARTUP_DATA,
    visitors: 10.5,
  });
  assert.equal(res5.isValid, false);
  assert.ok(res5.errors.visitors);

  // 6. Valid equal values (edge case: 100% conversion)
  const res6 = validateStartupInput({
    ...DEMO_STARTUP_DATA,
    visitors: 10,
    signups: 10,
    activated: 10,
    returning: 10,
  });
  assert.equal(res6.isValid, true);
});

test('Division by zero and zero traffic safely handled', () => {
  const metrics = calculateFunnelMetrics(0, 0, 0, 0);
  assert.equal(metrics.signupRate, 0);
  assert.equal(metrics.activationRate, 0);
  assert.equal(metrics.retentionProxyRate, 0);
  assert.equal(metrics.isZeroTraffic, true);

  const diagnosis = diagnoseFunnel(
    {
      productName: 'Zero App',
      productDescription: 'Testing zero traffic',
      targetAudience: 'Early adopters',
      visitors: 0,
      signups: 0,
      activated: 0,
      returning: 0,
    },
    metrics
  );

  assert.equal(diagnosis.stage, 'cold_start');
  assert.match(diagnosis.headline, /Zero visitors/i);
});

test('Acquisition-to-signup friction correctly diagnosed when top of funnel is broken', () => {
  // 5000 visitors, only 40 signups (0.8%), 30 activated (75%), 15 returning (50%)
  const metrics = calculateFunnelMetrics(5000, 40, 30, 15);
  const diagnosis = diagnoseFunnel(
    {
      productName: 'Traffic Leak Inc',
      productDescription: 'SaaS tool with high traffic but poor conversion',
      targetAudience: 'Freelancers',
      visitors: 5000,
      signups: 40,
      activated: 30,
      returning: 15,
    },
    metrics
  );

  assert.equal(diagnosis.stage, 'acquisition');
  assert.equal(metrics.signupRate, 0.8);
});

test('Retention friction correctly diagnosed when users activate but do not return', () => {
  // 1000 visitors, 100 signups (10%), 40 activated (40%), 2 returning (5%)
  const metrics = calculateFunnelMetrics(1000, 100, 40, 2);
  const diagnosis = diagnoseFunnel(
    {
      productName: 'One Time Wonder',
      productDescription: 'Tool users test once and forget',
      targetAudience: 'Designers',
      visitors: 1000,
      signups: 100,
      activated: 40,
      returning: 2,
    },
    metrics
  );

  assert.equal(diagnosis.stage, 'retention');
  assert.equal(metrics.retentionProxyRate, 5);
});
