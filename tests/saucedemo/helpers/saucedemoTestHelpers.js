/**
 * Shared helpers for Sauce Demo specs.
 */

export function requireStandardUserEnv() {
  const username = process.env.SAUCE_STANDARD_USERNAME;
  const password = process.env.SAUCE_STANDARD_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Missing SAUCE_STANDARD_USERNAME or SAUCE_STANDARD_PASSWORD. Copy .env.example to .env or set CI secrets.',
    );
  }

  return { username, password };
}

/**
 * @param {import('../../../pages/saucedemo/SaucedemoPageManager.js').SaucedemoPageManager} poManager
 */
export async function loginWithStandardUser(poManager) {
  const { username, password } = requireStandardUserEnv();
  const loginPage = poManager.getLoginPage();

  await loginPage.goto();
  await loginPage.login(username, password);
  await poManager.getInventoryPage().expectLoaded();
}

/**
 * @param {import('../../../pages/saucedemo/SaucedemoPageManager.js').SaucedemoPageManager} poManager
 */
export async function loginAndAddBackpackToCart(poManager) {
  await loginWithStandardUser(poManager);
  const inventoryPage = poManager.getInventoryPage();
  await inventoryPage.addProductToCart('add-to-cart-sauce-labs-backpack');
}
