import { expect } from '@playwright/test';

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.getByTestId('complete-header');
    this.overviewTitle = page.locator('.title');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
  }

  static parseDollarAmount(text) {
    const match = text.match(/\$([\d.]+)/);
    if (!match) {
      throw new Error(`Could not parse dollar amount from: ${text}`);
    }
    return Number.parseFloat(match[1]);
  }

  async expectCheckoutOverview() {
    await expect(this.overviewTitle).toHaveText('Checkout: Overview');
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
  }

  async getOrderSummary() {
    const subtotalText = await this.subtotalLabel.textContent();
    const taxText = await this.taxLabel.textContent();
    const totalText = await this.totalLabel.textContent();
    return {
      subtotal: CheckoutPage.parseDollarAmount(subtotalText ?? ''),
      tax: CheckoutPage.parseDollarAmount(taxText ?? ''),
      total: CheckoutPage.parseDollarAmount(totalText ?? ''),
    };
  }

  async expectOrderSummaryForSubtotal(expectedSubtotal) {
    const summary = await this.getOrderSummary();
    expect(summary.subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(summary.total).toBeCloseTo(summary.subtotal + summary.tax, 2);
  }


  async fillCheckoutInformation(info) {
    if (info.firstName !== undefined) {
      await this.firstNameInput.fill(info.firstName);
    } else {
      await this.firstNameInput.clear();
    }
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async expectInformationError(message) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }


  async finishOrder() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
