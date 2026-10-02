// @ts-check
/**
 * Automation Exercise — https://automationexercise.com/test_cases
 *
 * Test cases in this file:
 *   TC-06: Contact Us Form
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';
import { AutomationExercisePageManager } from '../../pages/automationexercise/AutomationExercisePageManager.js';
import { blockAds } from './helpers/test-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_FILE = path.join(__dirname, 'test-data', 'sample-upload.txt');

test.describe('Automation Exercise — Contact Us', () => {
  test.beforeEach(async ({ page }) => {
    await blockAds(page);
  });

  test('TC-06: Contact Us Form', async ({ page }) => {
    const poManager = new AutomationExercisePageManager(page);
    const homePage = poManager.getHomePage();
    const contactUsPage = poManager.getContactUsPage();

    await homePage.goto();
    await homePage.expectLoaded();

    await homePage.openContactUs();
    await contactUsPage.expectLoaded();

    await contactUsPage.fillForm({
      name: 'Test User',
      email: 'test.user@example.com',
      subject: 'Playwright contact form test',
      message: 'Checking that the Contact Us form submits with an attachment.',
    });
    await contactUsPage.uploadFile(UPLOAD_FILE);
    await contactUsPage.submit();

    await contactUsPage.expectSuccess();

    await contactUsPage.goHome();
    await expect(page).toHaveURL('/');
    await homePage.expectLoaded();
  });
});
