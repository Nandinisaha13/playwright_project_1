import { expect } from '@playwright/test';

/** Confirmation pages shown after creating or deleting an account. */
export class AccountResultPage {
  constructor(page) {
    this.page = page;
    this.accountCreatedHeading = page.getByRole('heading', { name: 'Account Created!' });
    this.accountDeletedHeading = page.getByRole('heading', { name: 'Account Deleted!' });
    this.continueButton = page.getByTestId('continue-button');
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async expectAccountDeleted() {
    await expect(this.accountDeletedHeading).toBeVisible();
  }

  async continue() {
    await this.continueButton.click();
  }
}
