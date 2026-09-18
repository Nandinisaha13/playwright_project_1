// @ts-check
import { test } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';
import { loginAndAddBackpackToCart } from './helpers/saucedemoTestHelpers.js';

test.describe('Sauce Demo — Checkout', () => {
  test('TC-09: Complete checkout (happy path)', async ({ page }) => {
    const poManager = new SaucedemoPageManager(page);
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginAndAddBackpackToCart(poManager);

    await poManager.getInventoryPage().openCart();
    await cartPage.expectLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.expectCheckoutInformationStep();
    await checkoutPage.fillCheckoutInformation({
      firstName: 'Nandini',
      lastName: 'Saha',
      postalCode: '12345',
    });
    await checkoutPage.continueCheckout();

    // await checkoutPage.expectCheckoutOverview();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('TC-10: Checkout with missing first name', async ({ page }) => {
    const poManager = new SaucedemoPageManager(page);
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginAndAddBackpackToCart(poManager);

    await poManager.getInventoryPage().openCart();
    await cartPage.expectLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.expectCheckoutInformationStep();
    await checkoutPage.fillCheckoutInformation({
      lastName: 'Saha',
      postalCode: '12345',
    });
    await checkoutPage.continueCheckout();

    await checkoutPage.expectInformationError('Error: First Name is required');
  });
});
