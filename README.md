# Playwright E2E — Sauce Demo

End-to-end UI tests for [Sauce Demo](https://www.saucedemo.com/) (Swag Labs), built with **Playwright** and **JavaScript**. Uses the **Page Object Model**, environment-based credentials, and **GitHub Actions** for CI.

## What’s covered

| Test | Scenario |
|------|----------|
| TC-01 | Login with valid credentials → inventory page |
| TC-02 | Login with invalid password → error message |
| TC-03 | Login with locked-out user → error message |

More flows (cart, checkout, sorting) are planned.

## Project structure

```text
├── pages/saucedemo/       # Page objects (locators + actions)
├── tests/saucedemo/       # Test specs
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

# Login specs only
npm run test:saucedemo:login

# Headed browser / Playwright UI
npm run test:headed
npm run test:ui

# HTML report after a run
npm run report
```

## CI (GitHub Actions)

On push or pull request to `main`, the workflow installs dependencies, runs Playwright, and uploads the HTML report as an artifact.

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
