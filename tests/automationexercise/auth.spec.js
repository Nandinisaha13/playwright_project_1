// @ts-check
/**
 * Automation Exercise — https://automationexercise.com/test_cases
 *
 * Test cases in this file:
 *   TC-01: Register User
 *   TC-02: Login User with correct email and password
 *   TC-03: Login User with incorrect email and password
 *   TC-04: Logout User
 *   TC-05: Register User with existing email
 */
import { test, expect } from '@playwright/test';
import { AutomationExercisePageManager } from '../../pages/automationexercise/AutomationExercisePageManager.js';
import {
  buildUser,
  createAccountViaApi,
  deleteAccountViaApi,
  blockAds,
} from './helpers/test-data.js';

test.describe('Automation Exercise — Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await blockAds(page);
  });

  test('TC-01: Register User', async ({ page, request }) => {
    const user = buildUser();
    const poManager = new AutomationExercisePageManager(page);
    const homePage = poManager.getHomePage();
    const loginPage = poManager.getLoginPage();
    const signupPage = poManager.getSignupPage();
    const accountResultPage = poManager.getAccountResultPage();

    try {
      await homePage.goto();
      await homePage.expectLoaded();

      await homePage.openSignupLogin();
      await loginPage.expectSignupFormVisible();
      await loginPage.startSignup(user.name, user.email);

      await signupPage.expectLoaded();
      await signupPage.fillAccountInformation(user);
      await signupPage.fillAddressInformation(user);
      await signupPage.createAccount();

      await accountResultPage.expectAccountCreated();
      await accountResultPage.continue();

      await homePage.expectLoggedInAs(user.name);

      await homePage.deleteAccount();
      await accountResultPage.expectAccountDeleted();
      await accountResultPage.continue();
    } finally {
      // No-op when the UI delete already succeeded; cleans up if the test failed midway.
      await deleteAccountViaApi(request, user);
    }
  });

  test('TC-02: Login User with correct email and password', async ({ page, request }) => {
    const user = buildUser();
    await createAccountViaApi(request, user);

    const poManager = new AutomationExercisePageManager(page);
    const homePage = poManager.getHomePage();
    const loginPage = poManager.getLoginPage();
    const accountResultPage = poManager.getAccountResultPage();

    try {
      await homePage.goto();
      await homePage.expectLoaded();

      await homePage.openSignupLogin();
      await loginPage.expectLoginFormVisible();
      await loginPage.login(user.email, user.password);

      await homePage.expectLoggedInAs(user.name);

      await homePage.deleteAccount();
      await accountResultPage.expectAccountDeleted();
    } finally {
      await deleteAccountViaApi(request, user);
    }
  });

  test('TC-03: Login User with incorrect email and password', async ({ page }) => {
    const user = buildUser(); // never registered, so these credentials are invalid
    const poManager = new AutomationExercisePageManager(page);
    const homePage = poManager.getHomePage();
    const loginPage = poManager.getLoginPage();

    await homePage.goto();
    await homePage.expectLoaded();

    await homePage.openSignupLogin();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(user.email, user.password);

    await loginPage.expectLoginError();
    await expect(homePage.loggedInAs).toBeHidden();
  });

  test('TC-04: Logout User', async ({ page, request }) => {
    const user = buildUser();
    await createAccountViaApi(request, user);

    const poManager = new AutomationExercisePageManager(page);
    const homePage = poManager.getHomePage();
    const loginPage = poManager.getLoginPage();

    try {
      await homePage.goto();
      await homePage.expectLoaded();

      await homePage.openSignupLogin();
      await loginPage.expectLoginFormVisible();
      await loginPage.login(user.email, user.password);
      await homePage.expectLoggedInAs(user.name);

      await homePage.logout();

      await expect(page).toHaveURL(/\/login$/);
      await loginPage.expectLoginFormVisible();
      await expect(homePage.loggedInAs).toBeHidden();
    } finally {
      await deleteAccountViaApi(request, user);
    }
  });

  test('TC-05: Register User with existing email', async ({ page, request }) => {
    const user = buildUser();
    await createAccountViaApi(request, user);

    const poManager = new AutomationExercisePageManager(page);
    const homePage = poManager.getHomePage();
    const loginPage = poManager.getLoginPage();

    try {
      await homePage.goto();
      await homePage.expectLoaded();

      await homePage.openSignupLogin();
      await loginPage.expectSignupFormVisible();
      await loginPage.startSignup(user.name, user.email);

      await loginPage.expectExistingEmailError();
      await expect(page).toHaveURL(/\/signup$/);
    } finally {
      await deleteAccountViaApi(request, user);
    }
  });
});
