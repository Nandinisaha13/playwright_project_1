import { expect } from '@playwright/test';

export class SignupPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Enter Account Information' });
    this.titleMrRadio = page.getByRole('radio', { name: 'Mr.' });
    this.passwordInput = page.getByTestId('password');
    this.daySelect = page.getByTestId('days');
    this.monthSelect = page.getByTestId('months');
    this.yearSelect = page.getByTestId('years');
    this.newsletterCheckbox = page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
    this.offersCheckbox = page.getByRole('checkbox', { name: 'Receive special offers from our partners!' });
    this.firstNameInput = page.getByTestId('first_name');
    this.lastNameInput = page.getByTestId('last_name');
    this.companyInput = page.getByTestId('company');
    this.addressInput = page.getByTestId('address');
    this.address2Input = page.getByTestId('address2');
    this.countrySelect = page.getByTestId('country');
    this.stateInput = page.getByTestId('state');
    this.cityInput = page.getByTestId('city');
    this.zipcodeInput = page.getByTestId('zipcode');
    this.mobileNumberInput = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async fillAccountInformation(user) {
    await this.titleMrRadio.check();
    await this.passwordInput.fill(user.password);
    await this.daySelect.selectOption(user.birthDay);
    await this.monthSelect.selectOption(user.birthMonth);
    await this.yearSelect.selectOption(user.birthYear);
    await this.newsletterCheckbox.check();
    await this.offersCheckbox.check();
  }

  async fillAddressInformation(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.addressInput.fill(user.address);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobileNumber);
  }

  async createAccount() {
    await this.createAccountButton.click();
  }
}
