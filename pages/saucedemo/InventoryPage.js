/**
 * Inventory (Products) page object for Sauce Demo.
 */
export class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
  }

  async expectLoaded() {
    await this.page.waitForURL('**/inventory.html');
    await this.title.waitFor({ state: 'visible' });
  }
}
