// @ts-check
import { test } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';

const SAUCE_LABS_BACKPACK = 'Sauce Labs Backpack';

test.describe('Sauce Demo — Cart', () => {
  test('TC-05: Add a product to the cart', async ({ page }) => {
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
    const cartPage = poManager.getCartPage();

    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.expectLoaded();

    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-backpack');
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(SAUCE_LABS_BACKPACK);
  });

  test('TC-06: Remove a product from the cart', async ({ page }) => {
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
    const cartPage = poManager.getCartPage();

    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.expectLoaded();

    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-backpack');
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(SAUCE_LABS_BACKPACK);

    await cartPage.removeProduct('remove-sauce-labs-backpack');
    await cartPage.expectCartEmpty();

    await cartPage.continueShopping();
    await inventoryPage.expectLoaded();
    await inventoryPage.expectCartBadgeNotVisible();
  });
});
