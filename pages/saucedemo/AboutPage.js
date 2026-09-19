import { expect } from '@playwright/test';

/** Sauce Demo “About” menu item navigates to the public Sauce Labs marketing site. */
export class AboutPage {
  constructor(page) {
    this.page = page;
  }

  async expectSauceLabsMarketingSite() {
    await expect(this.page).toHaveURL(/saucelabs\.com/);
  }
}
