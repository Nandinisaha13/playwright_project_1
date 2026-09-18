// @ts-check
import { test } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';
import { loginWithStandardUser, requireStandardUserEnv } from './helpers/saucedemoTestHelpers.js';

test.describe('Sauce Demo — Inventory', () => {
  test('TC-07: Sort products by name (A to Z)', async ({ page }) => {
    requireStandardUserEnv();

    const poManager = new SaucedemoPageManager(page);
    const inventoryPage = poManager.getInventoryPage();

    await loginWithStandardUser(poManager);

    await inventoryPage.sortBy('az');
    await inventoryPage.expectProductNamesSortedAscending();
  });

  test('TC-08: Sort products by price (low to high)', async ({ page }) => {
    requireStandardUserEnv();

    const poManager = new SaucedemoPageManager(page);
    const inventoryPage = poManager.getInventoryPage();

    await loginWithStandardUser(poManager);

    await inventoryPage.sortBy('lohi');
    await inventoryPage.expectProductPricesSortedLowToHigh();
  });
});
