---
name: playwright-e2e
description: Write, review, or debug Playwright E2E tests in this JavaScript (ES modules) project — page objects, selectors, assertions, waits, fixtures, and test organization. Use when adding or changing anything under pages/ or tests/.
version: 1.1.0
author: thetestingacademy (adapted for this repo)
license: MIT
---

# Playwright E2E Testing Skill (JavaScript)

You are an expert QA automation engineer specializing in Playwright end-to-end testing. When asked to write, review, or debug Playwright E2E tests in this repo, follow these instructions. **Use plain JavaScript with ES modules (`"type": "module"`): `.js` files, `import`/`export`, and explicit `.js` extensions in relative imports. Do not introduce TypeScript.**

## Core Principles

1. **User-centric testing** -- Write tests from the user's perspective, mirroring real journeys.
2. **Resilient selectors** -- Prefer `getByRole`, `getByLabel`, `getByText`, `getByTestId` over CSS/XPath.
3. **Auto-waiting** -- Rely on Playwright's auto-waiting. Avoid `waitForTimeout`.
4. **Isolation** -- Each test is independent. Never rely on state from a previous test.
5. **Readability** -- Tests are documentation.

## Project Structure (this repo)

```
pages/
  saucedemo/
    LoginPage.js
    InventoryPage.js
    CartPage.js
    CheckoutPage.js
    ProductDetailPage.js
    MenuPage.js
    AboutPage.js
    SaucedemoPageManager.js   # creates all page objects for one test
  <new-site>/                 # one folder per site under test
tests/
  saucedemo/
    login.spec.js
    cart.spec.js
    inventory.spec.js
    checkout.spec.js
    session.spec.js
    helpers/
  <new-site>/
test-cases/                   # markdown catalog of TC-xx scenarios
playwright.config.js
.env / .env.example           # credentials, never commit .env
```

Conventions:
- Page classes are named `XxxPage` in `XxxPage.js` (PascalCase), one class per file, exported by name.
- Specs are `<feature>.spec.js` and live under `tests/<site>/`.
- Each site gets its own `pages/<site>/` and `tests/<site>/` folders plus an `npm run test:<site>` script.
- New scenarios get a `TC-xx` id in the test title and an entry in `test-cases/<site>-test-cases.md`.

## Page Object Model

Each page class encapsulates locators and actions for a single page or component. Specs never construct page objects directly; they get them from the site's page manager.

### Concrete Page Class

```javascript
import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(message) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Page Object Manager

```javascript
import { LoginPage } from './LoginPage.js';
import { InventoryPage } from './InventoryPage.js';

export class SaucedemoPageManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  getLoginPage() { return this.loginPage; }
  getInventoryPage() { return this.inventoryPage; }
}
```

When adding a page object, register it in the manager and add a getter.

## Writing Test Specs

```javascript
// @ts-check
import { test, expect } from '@playwright/test';
import { SaucedemoPageManager } from '../../pages/saucedemo/SaucedemoPageManager.js';

test.describe('Sauce Demo — Login', () => {
  test('TC-01: Login with valid credentials', async ({ page }) => {
    const username = process.env.SAUCE_STANDARD_USERNAME;
    const password = process.env.SAUCE_STANDARD_PASSWORD;
    if (!username || !password) {
      throw new Error('Missing SAUCE_STANDARD_USERNAME or SAUCE_STANDARD_PASSWORD. Copy .env.example to .env.');
    }

    const poManager = new SaucedemoPageManager(page);
    const loginPage = poManager.getLoginPage();
    const inventoryPage = poManager.getInventoryPage();

    await loginPage.goto();
    await loginPage.login(username, password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
```

- Credentials come from `process.env` (loaded from `.env` by `playwright.config.js`; CI uses secrets). Never hardcode them.
- Keep specs focused on one feature; put shared helpers in `tests/<site>/helpers/`.

## Selectors -- Priority Order

1. **`getByRole`** -- Preferred (accessibility tree).
   ```javascript
   page.getByRole('button', { name: 'Submit' });
   page.getByRole('heading', { level: 1 });
   ```
2. **`getByLabel`** -- Form inputs with labels.
3. **`getByPlaceholder`** -- When there is no label.
4. **`getByText`** -- Non-interactive elements with visible text.
5. **`getByTestId`** -- This repo sets `testIdAttribute: 'data-test'` (Sauce Demo uses `data-test`, not `data-testid`), so `page.getByTestId('error')` matches `[data-test="error"]`.
6. **CSS/XPath** -- Last resort only; comment why the others failed.

## Assertions

Use web-first assertions that auto-retry:

```javascript
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Expected text');
await expect(locator).toContainText('partial');
await expect(locator).toHaveValue('value');
await expect(locator).toHaveCount(5);
await expect(page).toHaveURL(/inventory\.html/);
await expect(page).toHaveTitle('Swag Labs');
await expect(page).toHaveScreenshot('homepage.png');
```

## Fixtures

Use custom fixtures when several specs share setup, e.g. handing tests a ready page manager:

```javascript
import { test as base } from '@playwright/test';
import { SaucedemoPageManager } from '../pages/saucedemo/SaucedemoPageManager.js';

export const test = base.extend({
  poManager: async ({ page }, use) => {
    await use(new SaucedemoPageManager(page));
  },
});

export { expect } from '@playwright/test';
```

### Authentication State Reuse

```javascript
// auth.setup.js -- run once to store auth state
import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.SAUCE_STANDARD_USERNAME);
  await page.getByPlaceholder('Password').fill(process.env.SAUCE_STANDARD_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

(`playwright/.auth/` should be git-ignored.)

## Configuration (see `playwright.config.js`)

The existing config already sets: `testDir: './tests'`, `fullyParallel`, `forbidOnly` on CI, `workers: 1` on CI, `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, dotenv loading, and a single `chromium` project. Prefer changing these in the config rather than per test.

When adding a second site, either use full URLs in that site's page objects or add a Playwright `project` per site with its own `baseURL` and `testMatch`, instead of overwriting the shared `baseURL`.

## Handling Common Scenarios

### Dialogs
```javascript
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('confirm');
  await dialog.accept();
});
```

### File Upload
```javascript
await page.getByLabel('Upload document').setInputFiles('test-data/sample.pdf');
```

### Iframes
```javascript
const iframe = page.frameLocator('#payment-iframe');
await iframe.getByLabel('Card number').fill('4111111111111111');
```

### Network Interception
```javascript
await page.route('**/api/products', (route) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
);

const responsePromise = page.waitForResponse('**/api/submit');
await page.getByRole('button', { name: 'Submit' }).click();
expect((await responsePromise).status()).toBe(200);
```

### Dropdowns
```javascript
await page.getByLabel('Country').selectOption('US');                    // native select
await page.getByRole('combobox', { name: 'Country' }).click();          // custom dropdown
await page.getByRole('option', { name: 'United States' }).click();
```

### New tab / popup
```javascript
const popupPromise = page.waitForEvent('popup');
await page.getByRole('link', { name: 'About' }).click();
const popup = await popupPromise;
```

## Best Practices

1. **Never use `page.waitForTimeout()`** -- use auto-waiting or explicit event waits.
2. **Group related tests** in `test.describe`.
3. **Keep `beforeEach` minimal.**
4. **Tag tests** for selective runs: `test('checkout flow @smoke', ...)` then `--grep @smoke`.
5. **Use `expect.soft`** for non-blocking checks.
6. **Parameterize** with arrays and a `for...of` loop generating tests.
7. **Set timeouts in config**, not per test.
8. **Use the trace viewer** for debugging: `npx playwright show-trace trace.zip`.
9. **Keep tests isolated** so `fullyParallel` is safe.
10. **Clean up test data** with `afterEach` or fixture teardown.

## Anti-Patterns to Avoid

1. Hardcoded waits (`waitForTimeout`).
2. Shared mutable state between tests.
3. Testing implementation details instead of behavior.
4. Overly specific selectors (`div.container > ul > li:nth-child(3)`).
5. Giant spec files.
6. Order-dependent tests.
7. Full URLs in `goto` when `baseURL` is configured.
8. Committing credentials or `.env`.
9. Hitting third-party services directly -- mock them.
10. Constructing page objects inside specs instead of via the page manager.

## Debugging Tips

- Headed: `npm run test:headed`
- UI mode: `npm run test:ui`
- Single spec: `npx playwright test tests/saucedemo/login.spec.js --debug`
- Codegen: `npx playwright codegen https://www.saucedemo.com`
- Report: `npm run report`
- `test.only` to isolate a test (CI fails on it via `forbidOnly`).
- `await page.pause()` to inspect the page.
