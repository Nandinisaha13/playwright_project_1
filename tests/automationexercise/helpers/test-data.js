import { expect } from '@playwright/test';

/** Builds a unique user so every test run registers a fresh account (no shared state). */
export function buildUser() {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: `qa_user_${id}`,
    email: `qa_user_${id}@example.com`,
    password: `Pw!${id}`,
    birthDay: '15',
    birthMonth: 'May',
    birthYear: '1990',
    firstName: 'Test',
    lastName: 'User',
    company: 'QA Labs',
    address: '123 Test Street',
    address2: 'Suite 4',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    zipcode: '560001',
    mobileNumber: '9876543210',
  };
}

/** Creates an account through the site's REST API so a test can start from an existing user. */
export async function createAccountViaApi(request, user) {
  const response = await request.post('/api/createAccount', {
    form: {
      name: user.name,
      email: user.email,
      password: user.password,
      title: 'Mr',
      birth_date: user.birthDay,
      birth_month: user.birthMonth,
      birth_year: user.birthYear,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobileNumber,
    },
  });
  // The API always answers HTTP 200; the real status is in the JSON body.
  const body = await response.json();
  expect(body.responseCode, body.message).toBe(201);
}

/** Removes a user through the API (safety net when a test fails before the UI delete step). */
export async function deleteAccountViaApi(request, user) {
  try {
    await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
      timeout: 10_000,
    });
  } catch {
    // Best-effort cleanup: never mask the test's own result (e.g. after a test timeout closes the context).
  }
}

/** Blocks ad/tracker requests: their overlays and iframes intercept clicks on this site. */
export async function blockAds(page) {
  await page.route(/googlesyndication|doubleclick|googleadservices|adservice/, (route) => route.abort());
}
