import { LoginPage } from './LoginPage.js';
import { InventoryPage } from './InventoryPage.js';
import { CartPage } from './CartPage.js';
import { CheckoutPage } from './CheckoutPage.js';
import { ProductDetailPage } from './ProductDetailPage.js';
import { MenuPage } from './MenuPage.js';
import { AboutPage } from './AboutPage.js';

/**
 * Page Object Manager — one instance per test; page objects are created here, not in specs.
 */
export class SaucedemoPageManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.productDetailPage = new ProductDetailPage(page);
    this.menuPage = new MenuPage(page);
    this.aboutPage = new AboutPage(page);
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

  getCheckoutPage() {
    return this.checkoutPage;
  }

  getProductDetailPage() {
    return this.productDetailPage;
  }

  getMenuPage() {
    return this.menuPage;
  }

  getAboutPage() {
    return this.aboutPage;
  }
}
