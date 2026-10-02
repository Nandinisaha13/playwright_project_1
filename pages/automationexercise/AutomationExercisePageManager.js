import { HomePage } from './HomePage.js';
import { LoginPage } from './LoginPage.js';
import { SignupPage } from './SignupPage.js';
import { AccountResultPage } from './AccountResultPage.js';
import { ContactUsPage } from './ContactUsPage.js';

/**
 * Page Object Manager — one instance per test; page objects are created here, not in specs.
 */
export class AutomationExercisePageManager {
  constructor(page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.signupPage = new SignupPage(page);
    this.accountResultPage = new AccountResultPage(page);
    this.contactUsPage = new ContactUsPage(page);
  }

  getHomePage() {
    return this.homePage;
  }

  getLoginPage() {
    return this.loginPage;
  }

  getSignupPage() {
    return this.signupPage;
  }

  getAccountResultPage() {
    return this.accountResultPage;
  }

  getContactUsPage() {
    return this.contactUsPage;
  }
}
