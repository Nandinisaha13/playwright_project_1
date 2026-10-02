import { expect } from '@playwright/test';

export class ContactUsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.subjectInput = page.getByTestId('subject');
    this.messageInput = page.getByTestId('message');
    this.fileInput = page.locator('input[type="file"]'); // no label/role for the hidden file input
    this.submitButton = page.getByTestId('submit-button');
    // The page also holds a hidden duplicate of this text, so target the visible .status banner.
    this.successMessage = page.locator('.status', { hasText: 'Success! Your details have been submitted successfully.' });
    this.homeButton = page.locator('#form-section').getByRole('link', { name: 'Home' });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    // Page scripts can still be running after the heading renders and may reset a form that was filled too early.
    await this.page.waitForLoadState('load');
  }

  async fillForm({ name, email, subject, message }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
  }

  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
  }

  /** Submits the form and accepts the browser confirm dialog that follows. */
  async submit() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }

  async expectSuccess() {
    await expect(this.successMessage).toBeVisible();
  }

  async goHome() {
    await this.homeButton.click();
  }
}
