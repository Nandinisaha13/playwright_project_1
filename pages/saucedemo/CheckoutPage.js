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
