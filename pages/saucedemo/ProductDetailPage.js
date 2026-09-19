import { expect } from '@playwright/test';

export class ProductDetailPage {
  constructor(page) {
    this.page = page;
    this.details = page.locator('div.inventory_details');
    this.productName = this.details.getByTestId('inventory-item-name');
    this.productPrice = this.details.getByTestId('inventory-item-price');
    this.backToProductsLink = page.getByTestId('back-to-products');
  }

  async expectLoaded(productName) {
    await expect(this.details).toBeVisible();
    await expect(this.details).toContainText(productName);
    await expect(this.details.locator('.inventory_details_price')).toBeVisible();
  }

  async addToCart() {
    await this.details.getByRole('button', { name: 'Add to cart' }).click();
  }

  async backToProducts() {
    await this.backToProductsLink.click();
  }
}
