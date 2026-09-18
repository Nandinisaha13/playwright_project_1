import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartList = page.locator('.cart_list');
    this.cartItem = page.locator('.cart_item');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
  }

  async expectLoaded() {
    await this.page.waitForURL('**/cart.html');
    await expect(this.title).toHaveText('Your Cart');
    await expect(this.cartList).toBeVisible();
  }

  async expectProductInCart(productName) {
    const item = this.cartItem.filter({ hasText: productName });
    await expect(item).toHaveCount(1);
    await expect(item.locator('[data-test="inventory-item-name"]')).toHaveText(productName);
    await expect(item.locator('[data-test="inventory-item-price"]')).toBeVisible();
  }
}
