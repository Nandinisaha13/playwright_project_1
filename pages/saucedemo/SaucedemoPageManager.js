import { LoginPage } from './LoginPage.js';
import { InventoryPage } from './InventoryPage.js';
import { CartPage } from './CartPage.js';

/**
 * Page Object Manager — one instance per test; page objects are created here, not in specs.
 */
export class SaucedemoPageManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getInventoryPage() {
    return this.inventoryPage;
  }

  getCartPage() {
    return this.cartPage;
  }
}
