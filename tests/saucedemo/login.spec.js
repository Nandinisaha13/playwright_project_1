// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage.js';

/**
 * Sauce Demo — Login tests
 * Sauce Demo login scenarios (TC-01–TC-03)
 * Credentials: .env (local) or GitHub Actions secrets (CI) — loaded in playwright.config.js
 */
test.describe('Sauce Demo — Login', () => {
  /**
   * TC-01: Login with valid credentials
   * User logs in and lands on the Products / inventory page.
   */
  test('TC-01: Login with valid credentials', async ({ page }) => {
    const username = process.env.SAUCE_STANDARD_USERNAME;
    const password = process.env.SAUCE_STANDARD_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Missing SAUCE_STANDARD_USERNAME or SAUCE_STANDARD_PASSWORD. Copy .env.example to .env or set CI secrets.',
      );
    }

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();

    await loginPage.login(username, password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.inventoryList).toBeVisible();
  });

  /**
   * TC-02: Login with invalid password
   */
  test('TC-02: Login with invalid password', async ({ page }) => {
    const username = process.env.SAUCE_STANDARD_USERNAME;
    const password = process.env.SAUCE_INVALID_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Missing SAUCE_STANDARD_USERNAME or SAUCE_INVALID_PASSWORD. Copy .env.example to .env or set CI secrets.',
      );
    }

    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);

    await loginPage.expectOnLoginPage();
    await loginPage.expectErrorMessage(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  /**
   * TC-03: Login with locked-out user
   */
  test('TC-03: Login with locked-out user', async ({ page }) => {
    const username = process.env.SAUCE_LOCKED_OUT_USERNAME;
    const password = process.env.SAUCE_LOCKED_OUT_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Missing SAUCE_LOCKED_OUT_USERNAME or SAUCE_LOCKED_OUT_PASSWORD. Copy .env.example to .env or set CI secrets.',
      );
    }

    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);

    await loginPage.expectOnLoginPage();
    await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });
});
