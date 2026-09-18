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
  }

  async expectCheckoutInformationStep() {
    await this.page.waitForURL('**/checkout-step-one.html');
    await expect(this.firstNameInput).toBeVisible();
  }

  /**
   * @param {{ firstName?: string, lastName: string, postalCode: string }} info
   */
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

  // async expectCheckoutOverview() {
  //   await this.page.waitForURL('**/checkout-step-two.html');
  //   await expect(this.page.getByTestId('payment-info-label')).toBeVisible();
  //   await expect(this.page.getByTestId('shipping-info-label')).toBeVisible();
  //   await expect(this.page.getByTestId('subtotal-label')).toBeVisible();
  //   await expect(this.page.getByTestId('inventory-item-name')).toBeVisible();
  // }

  async finishOrder() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await this.page.waitForURL('**/checkout-complete.html');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
