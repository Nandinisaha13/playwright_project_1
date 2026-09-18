// @ts-check
import { test, expect } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';

/**
 * Sauce Demo — Login tests (TC-01–TC-04)
 * Credentials: .env locally or GitHub Actions secrets in CI
 */
test.describe('Sauce Demo — Login', () => {
  test('TC-01: Login with valid credentials', async ({ page }) => {
    const username = process.env.SAUCE_STANDARD_USERNAME;
    const password = process.env.SAUCE_STANDARD_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Missing SAUCE_STANDARD_USERNAME or SAUCE_STANDARD_PASSWORD. Copy .env.example to .env or set CI secrets.',
      );
    }

    const poManager = new SaucedemoPageManager(page);
    const loginPage = poManager.getLoginPage();
    const inventoryPage = poManager.getInventoryPage();

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(username, password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.inventoryList).toBeVisible();
  });

  test('TC-02: Login with invalid password', async ({ page }) => {
    const username = process.env.SAUCE_STANDARD_USERNAME;
    const password = process.env.SAUCE_INVALID_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Missing SAUCE_STANDARD_USERNAME or SAUCE_INVALID_PASSWORD. Copy .env.example to .env or set CI secrets.',
      );
    }

    const poManager = new SaucedemoPageManager(page);
    const loginPage = poManager.getLoginPage();

    await loginPage.goto();
    await loginPage.login(username, password);

    await loginPage.expectErrorMessage(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('TC-03: Login with locked-out user', async ({ page }) => {
    const username = process.env.SAUCE_LOCKED_OUT_USERNAME;
    const password = process.env.SAUCE_LOCKED_OUT_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Missing SAUCE_LOCKED_OUT_USERNAME or SAUCE_LOCKED_OUT_PASSWORD. Copy .env.example to .env or set CI secrets.',
      );
    }

    const poManager = new SaucedemoPageManager(page);
    const loginPage = poManager.getLoginPage();

    await loginPage.goto();
    await loginPage.login(username, password);

    await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });

  test('TC-04: Login with empty credentials', async ({ page }) => {
    const poManager = new SaucedemoPageManager(page);
    const loginPage = poManager.getLoginPage();

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
    await loginPage.submitLogin();

    await loginPage.expectErrorMessage('Epic sadface: Username is required');
  });
});
