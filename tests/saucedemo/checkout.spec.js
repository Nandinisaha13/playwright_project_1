// @ts-check
import { test, expect } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';
import {
  loginAndAddBackpackToCart,
  loginWithStandardUser,
  requireStandardUserEnv,
} from './helpers/saucedemoTestHelpers.js';

/** All six inventory items — data-test ids match Sauce Demo add-to-cart buttons */
const TWO_CART_PRODUCTS = [
  { name: 'Sauce Labs Backpack', addToCartTestId: 'add-to-cart-sauce-labs-backpack' },
  { name: 'Sauce Labs Bike Light', addToCartTestId: 'add-to-cart-sauce-labs-bike-light' },
];

const MULTI_CART_PRODUCTS = [
  { name: 'Sauce Labs Backpack', addToCartTestId: 'add-to-cart-sauce-labs-backpack' },
  { name: 'Sauce Labs Bike Light', addToCartTestId: 'add-to-cart-sauce-labs-bike-light' },
  { name: 'Sauce Labs Bolt T-Shirt', addToCartTestId: 'add-to-cart-sauce-labs-bolt-t-shirt' },
  { name: 'Sauce Labs Fleece Jacket', addToCartTestId: 'add-to-cart-sauce-labs-fleece-jacket' },
  { name: 'Sauce Labs Onesie', addToCartTestId: 'add-to-cart-sauce-labs-onesie' },
  {
    name: 'Test.allTheThings() T-Shirt (Red)',
    addToCartTestId: 'add-to-cart-test.allthethings()-t-shirt-(red)',
  },
];

test.describe('Sauce Demo — Checkout', () => {
  test('TC-09: Complete checkout (happy path)', async ({ page }) => {
    const poManager = new SaucedemoPageManager(page);
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginAndAddBackpackToCart(poManager);

    await poManager.getInventoryPage().openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCheckoutInformation({
      firstName: 'Nandini',
      lastName: 'Saha',
      postalCode: '12345',
    });
    await checkoutPage.continueCheckout();

    
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('TC-10: Checkout with missing first name', async ({ page }) => {
    const poManager = new SaucedemoPageManager(page);
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginAndAddBackpackToCart(poManager);

    await poManager.getInventoryPage().openCart();
    await cartPage.proceedToCheckout();

    
    await checkoutPage.fillCheckoutInformation({
      lastName: 'Saha',
      postalCode: '12345',
    });
    await checkoutPage.continueCheckout();

    await checkoutPage.expectInformationError('Error: First Name is required');
  });

  test('TC-11: Multi-item cart total and checkout with details', async ({ page }) => {
    requireStandardUserEnv();

    const poManager = new SaucedemoPageManager(page);
    const inventoryPage = poManager.getInventoryPage();
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginWithStandardUser(poManager);

    for (const product of MULTI_CART_PRODUCTS) {
      await inventoryPage.addProductToCart(product.addToCartTestId);
    }
    await inventoryPage.expectCartBadgeCount(MULTI_CART_PRODUCTS.length);

    await inventoryPage.openCart();
    await cartPage.expectItemCount(MULTI_CART_PRODUCTS.length);
    for (const product of MULTI_CART_PRODUCTS) {
      await cartPage.expectProductInCart(product.name);
    }

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

  test('TC-14: Cancel checkout preserves cart, then complete order', async ({ page }) => {
    requireStandardUserEnv();

    const poManager = new SaucedemoPageManager(page);
    const inventoryPage = poManager.getInventoryPage();
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginWithStandardUser(poManager);

    for (const product of TWO_CART_PRODUCTS) {
      await inventoryPage.addProductToCart(product.addToCartTestId);
    }
    await inventoryPage.expectCartBadgeCount(TWO_CART_PRODUCTS.length);

    await inventoryPage.openCart();
    await cartPage.expectItemCount(TWO_CART_PRODUCTS.length);
    for (const product of TWO_CART_PRODUCTS) {
      await cartPage.expectProductInCart(product.name);
    }

    const cartPrices = await cartPage.getItemPrices();
    const expectedSubtotal = cartPage.sumPrices(cartPrices);

    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutInformationStep();
    await checkoutPage.cancelCheckout();

    await cartPage.expectOnCartPage();
    await cartPage.expectItemCount(TWO_CART_PRODUCTS.length);
    for (const product of TWO_CART_PRODUCTS) {
      await cartPage.expectProductInCart(product.name);
    }
    const cartPricesAfterCancel = await cartPage.getItemPrices();
    expect(cartPage.sumPrices(cartPricesAfterCancel)).toBeCloseTo(expectedSubtotal, 2);

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
