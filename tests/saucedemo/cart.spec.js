// @ts-check
import { test } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';
import {
  loginWithStandardUser,
  requireStandardUserEnv,
} from './helpers/saucedemoTestHelpers.js';

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

    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-backpack');
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.openCart();
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

    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-backpack');
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.openCart();
    await cartPage.expectProductInCart(SAUCE_LABS_BACKPACK);

    await cartPage.removeProduct('remove-sauce-labs-backpack');
    await cartPage.expectCartEmpty();

    await cartPage.continueShopping();
    await inventoryPage.expectCartBadgeNotVisible();
  });

  test('TC-12: Edit cart, continue shopping, sort and checkout with updated totals', async ({
    page,
  }) => {
    requireStandardUserEnv();

    const poManager = new SaucedemoPageManager(page);
    const inventoryPage = poManager.getInventoryPage();
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginWithStandardUser(poManager);

    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-backpack');
    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-fleece-jacket');
    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-bolt-t-shirt');
    await inventoryPage.expectCartBadgeCount(3);

    await inventoryPage.openCart();
    await cartPage.removeProduct('remove-sauce-labs-fleece-jacket');
    await cartPage.expectItemCount(2);
    await cartPage.continueShopping();

    await inventoryPage.sortBy('lohi');
    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-bike-light');
    await inventoryPage.expectCartBadgeCount(3);

    await inventoryPage.openCart();
    await cartPage.expectItemCount(3);
    await cartPage.expectProductInCart('Sauce Labs Backpack');
    await cartPage.expectProductInCart('Sauce Labs Bolt T-Shirt');
    await cartPage.expectProductInCart('Sauce Labs Bike Light');

    const cartPrices = await cartPage.getItemPrices();
    const expectedSubtotal = cartPage.sumPrices(cartPrices);

    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInformation({
      firstName: 'Nandini',
      lastName: 'Saha',
      postalCode: '12345',
    });
    await checkoutPage.continueCheckout();
    await checkoutPage.expectCheckoutOverview();
    await checkoutPage.expectOrderSummaryForSubtotal(expectedSubtotal);
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });
});
