export function requireStandardUserEnv() {
  const username = process.env.SAUCE_STANDARD_USERNAME;
  const password = process.env.SAUCE_STANDARD_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'Missing SAUCE_STANDARD_USERNAME or SAUCE_STANDARD_PASSWORD. Copy .env.example to .env or set CI secrets.',
    );
  }
}

export async function loginWithStandardUser(poManager) {
  requireStandardUserEnv();
  const loginPage = poManager.getLoginPage();
  const inventoryPage = poManager.getInventoryPage();
  await loginPage.goto();
  await loginPage.login(
    process.env.SAUCE_STANDARD_USERNAME,
    process.env.SAUCE_STANDARD_PASSWORD,
  );
  await inventoryPage.expectLoaded();
}

export async function loginAndAddBackpackToCart(poManager) {
  await loginWithStandardUser(poManager);
  await poManager.getInventoryPage().addProductToCart('add-to-cart-sauce-labs-backpack');
}
