import { expect } from '@playwright/test';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.loggedInAs = page.getByText(/Logged in as/);
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectLoaded() {
    await expect(this.page).toHaveTitle('Automation Exercise');
    await expect(this.signupLoginLink).toBeVisible();
  }

  async openSignupLogin() {
    await this.signupLoginLink.click();
  }

  async expectLoggedInAs(name) {
    await expect(this.loggedInAs).toContainText(name);
  }

  async openContactUs() {
    await this.contactUsLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }
}
