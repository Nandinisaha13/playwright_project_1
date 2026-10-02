import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmailInput = page.getByTestId('login-email');
    this.loginPasswordInput = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
    this.existingEmailError = page.getByText('Email Address already exist!');
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupNameInput = page.getByTestId('signup-name');
    this.signupEmailInput = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');
  }

  async expectLoginFormVisible() {
    await expect(this.loginHeading).toBeVisible();
  }

  async expectLoginError() {
    await expect(this.loginErrorMessage).toBeVisible();
  }

  async expectExistingEmailError() {
    await expect(this.existingEmailError).toBeVisible();
  }

  async expectSignupFormVisible() {
    await expect(this.signupHeading).toBeVisible();
  }

  async startSignup(name, email) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async login(email, password) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}
