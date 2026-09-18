import { expect } from '@playwright/test';

export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
  }

  async expectLoaded() {
    await this.page.waitForURL('**/inventory.html');
    await this.title.waitFor({ state: 'visible' });
  }

 
  async addProductToCart(addToCartTestId) {
    await this.page.getByTestId(addToCartTestId).click();
  }

  async expectCartBadgeCount(count) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async openCart() {
    await this.cartLink.click();
  }

  async expectCartBadgeNotVisible() {
    await expect(this.cartBadge).toHaveCount(0);
  }

  
  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async expectProductNamesSortedAscending() {
    const names = await this.productNames.allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  }

  async expectProductPricesSortedLowToHigh() {
    const priceTexts = await this.productPrices.allTextContents();
    const prices = priceTexts.map((text) => Number.parseFloat(text.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  }
}
