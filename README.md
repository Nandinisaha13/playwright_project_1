# Playwright E2E — Sauce Demo

End-to-end UI tests for [Sauce Demo](https://www.saucedemo.com/) (Swag Labs), built with **Playwright** and **JavaScript**. Uses the **Page Object Model**, environment-based credentials, and **GitHub Actions** for CI.

## What’s covered

| Test | Scenario |
|------|----------|
| TC-01 | Login with valid credentials → inventory page |
| TC-02 | Login with invalid password → error message |
| TC-03 | Login with locked-out user → error message |
| TC-04 | Login with empty credentials → username required error |
| TC-05 | Add Sauce Labs Backpack to cart → badge and cart contents |
| TC-06 | Remove product from cart → empty cart, no badge |
| TC-07 | Sort inventory by name (A → Z) |
| TC-08 | Sort inventory by price (low → high) |
| TC-09 | Complete checkout (happy path) |
| TC-10 | Checkout validation — missing first name |
| TC-11 | All six products in cart — verify subtotal/total math, then complete checkout |
| TC-12 | Remove item from cart, continue shopping, sort and add item — checkout with updated totals |
| TC-13 | Add via product detail page, logout, re-login — cart still has items (localStorage) |
| TC-14 | Cancel checkout — cart unchanged, then complete order |
| TC-15 | Menu About → Sauce Labs site, return to demo and inventory |

All catalogued Sauce Demo scenarios (TC-01–TC-15) are automated.

## Project structure

```text
├── pages/saucedemo/       # Page objects + SaucedemoPageManager (getLoginPage, …)
├── tests/saucedemo/       # Test specs (login, cart, …)
├── .env.example           # Template for credentials (copy to .env)
├── playwright.config.js   # Playwright + baseURL + dotenv
└── .github/workflows/     # CI on push/PR
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm

## Setup

```bash
git clone https://github.com/Nandinisaha13/playwright_project_1.git
cd playwright_project_1
npm ci
npx playwright install chromium
cp .env.example .env
```

Fill in `.env` using the Sauce Demo demo accounts (see [saucedemo.com](https://www.saucedemo.com/) — credentials are documented on the login page). **Do not commit `.env`.**

## Run tests

```bash
# All tests
npm test

# Sauce Demo only
npm run test:saucedemo

# Login or cart specs only
npm run test:saucedemo:login
npm run test:saucedemo:cart
npm run test:saucedemo:inventory
npm run test:saucedemo:checkout

# Headed browser / Playwright UI
npm run test:headed
npm run test:ui

# HTML report after a run
npm run report
```

## CI (GitHub Actions)

Workflow: [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)

On push or pull request to `main` / `master`, GitHub Actions will:

1. Install dependencies and Playwright **Chromium** (with browser cache)
2. Verify all required secrets are set (fail fast with a clear error if any are missing)
3. Run `npm run test:saucedemo` (TC-01–TC-15)
4. Upload the **HTML report** on every run; upload **screenshots / video / traces** if tests fail

Add these **repository secrets** (Settings → Secrets and variables → Actions) so tests can log in:

- `SAUCE_STANDARD_USERNAME`
- `SAUCE_STANDARD_PASSWORD`
- `SAUCE_LOCKED_OUT_USERNAME`
- `SAUCE_LOCKED_OUT_PASSWORD`
- `SAUCE_INVALID_PASSWORD`

Names match [`.env.example`](.env.example).

## Tech stack

- [@playwright/test](https://playwright.dev/)
- [dotenv](https://github.com/motdotla/dotenv) for local env loading
- GitHub Actions

## Author

[Nandinisaha13](https://github.com/Nandinisaha13)
