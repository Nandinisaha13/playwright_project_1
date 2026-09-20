// @ts-check
/**
 * TEMPORARY — delete this file after you confirm CI retries in GitHub Actions logs.
 * Config: playwright.config.js → retries: 2 when CI=true (3 total attempts per test).
 */
import { test, expect } from '@playwright/test';

test.describe('CI retry probe (remove after verification)', () => {
  test('deliberately fails so Playwright retries on CI', async ({}, testInfo) => {
    const attempt = testInfo.retry + 1;
    const maxAttempts = testInfo.project.retries + 1;
    console.log(`[ci-retry-probe] attempt ${attempt} of ${maxAttempts} (retry index ${testInfo.retry})`);
    expect(
      attempt,
      'Intentional failure — job should still show retry #1 and retry #2 in CI before final fail',
    ).toBeGreaterThan(maxAttempts);
  });
});
