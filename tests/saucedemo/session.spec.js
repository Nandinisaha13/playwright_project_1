// @ts-check
import { test } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';
import {
  loginWithStandardUser,
  requireStandardUserEnv,
} from './helpers/saucedemoTestHelpers.js';

test.describe('Sauce Demo — Session', () => {
  test('TC-13: Add from product page, logout, re-login — cart still has items', async ({
    page,
  }) => {
    requireStandardUserEnv();

    const poManager = new SaucedemoPageManager(page);
    const loginPage = poManager.getLoginPage();
    const inventoryPage = poManager.getInventoryPage();
    const productDetailPage = poManager.getProductDetailPage();
    const menuPage = poManager.getMenuPage();
    const cartPage = poManager.getCartPage();

    await loginWithStandardUser(poManager);

    await inventoryPage.openProductDetails('Sauce Labs Backpack');
    await productDetailPage.expectLoaded('Sauce Labs Backpack');
    await productDetailPage.addToCart();
    await productDetailPage.backToProducts();
    await inventoryPage.expectLoaded();

    await inventoryPage.addProductToCart('add-to-cart-sauce-labs-bike-light');
    await inventoryPage.expectCartBadgeCount(2);

    await menuPage.logout();
    await loginPage.expectLoginScreen();

    await loginWithStandardUser(poManager);
    await inventoryPage.expectCartBadgeCount(2);
    await inventoryPage.openCart();
    await cartPage.expectItemCount(2);
    await cartPage.expectProductInCart('Sauce Labs Backpack');
    await cartPage.expectProductInCart('Sauce Labs Bike Light');
  });
});
