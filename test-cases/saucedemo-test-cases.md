# Sauce Demo — Test Case Catalog

**App under test:** [https://www.saucedemo.com/](https://www.saucedemo.com/)  
**Purpose:** Track planned scenarios and implementation status. Specs live under `tests/saucedemo/`.

| Status | Meaning |
|--------|---------|
| Planned | Documented, not automated yet |
| In progress | Being implemented |
| Done | Automated and passing |

---

## TC-01: Login with valid credentials

| Field | Detail |
|-------|--------|
| **Status** | Done |
| **Priority** | High |
| **Spec** | `tests/saucedemo/login.spec.js` |
| **Preconditions** | User is on the Sauce Demo login page |
| **Test data** | Username / password from env: `SAUCE_STANDARD_USERNAME`, `SAUCE_STANDARD_PASSWORD` (see `.env.example`) |

### Steps

1. Launch browser and open Sauce Demo.
2. Verify the login page is visible (username, password, Login button).
3. Enter valid username and password.
4. Click **Login**.
5. Verify the user lands on the inventory page (`/inventory.html`).
6. Verify the **Products** heading is visible.

### Expected result

User is logged in and the inventory / products page is displayed.

---

## TC-02: Login with invalid password

| Field | Detail |
|-------|--------|
| **Status** | Done |
| **Priority** | High |
| **Spec** | `tests/saucedemo/login.spec.js` |
| **Test data** | `SAUCE_STANDARD_USERNAME`, `SAUCE_INVALID_PASSWORD` (see `.env.example`) |

### Steps

1. Open Sauce Demo login page.
2. Enter valid username and invalid password.
3. Click **Login**.
4. Verify error message is visible: *Epic sadface: Username and password do not match any user in this service*

### Expected result

Login fails; user remains on the login page with an error.

---

## TC-03: Login with locked-out user

| Field | Detail |
|-------|--------|
| **Status** | Done |
| **Priority** | High |
| **Spec** | `tests/saucedemo/login.spec.js` |
| **Test data** | `SAUCE_LOCKED_OUT_USERNAME`, `SAUCE_LOCKED_OUT_PASSWORD` (see `.env.example`) |

### Steps

1. Open Sauce Demo login page.
2. Enter locked-out user credentials.
3. Click **Login**.
4. Verify error: *Epic sadface: Sorry, this user has been locked out.*

### Expected result

Login is blocked; locked-out message is shown.

---

## TC-04: Login with empty credentials

| Field | Detail |
|-------|--------|
| **Status** | Planned |
| **Priority** | Medium |
| **Spec** | `tests/saucedemo/login.spec.js` (planned) |

### Steps

1. Open Sauce Demo login page.
2. Leave username and password empty.
3. Click **Login**.
4. Verify error: *Epic sadface: Username is required*

### Expected result

Validation error is shown; user is not logged in.

---

## TC-05: Add a product to the cart

| Field | Detail |
|-------|--------|
| **Status** | Planned |
| **Priority** | High |
| **Spec** | `tests/saucedemo/cart.spec.js` (planned) |
| **Preconditions** | User is logged in as `standard_user` |

### Steps

1. On inventory page, click **Add to cart** for a product (e.g. Sauce Labs Backpack).
2. Verify cart badge shows `1`.
3. Open the cart.
4. Verify the product name and details appear in the cart.

### Expected result

Product is added; cart count and cart contents are correct.

---

## TC-06: Remove a product from the cart

| Field | Detail |
|-------|--------|
| **Status** | Planned |
| **Priority** | High |
| **Spec** | `tests/saucedemo/cart.spec.js` (planned) |

### Steps

1. Add a product to the cart.
2. Click **Remove** (from inventory or cart).
3. Verify cart badge is gone or count decreases.
4. If on cart page, verify the product is no longer listed.

### Expected result

Product is removed from the cart.

---

## TC-07: Sort products by name (A to Z)

| Field | Detail |
|-------|--------|
| **Status** | Planned |
| **Priority** | Medium |
| **Spec** | `tests/saucedemo/inventory.spec.js` (planned) |

### Steps

1. Log in and open inventory.
2. Select sort option **Name (A to Z)**.
3. Verify product names are in ascending alphabetical order.

### Expected result

Products are sorted A → Z.

---

## TC-08: Sort products by price (low to high)

| Field | Detail |
|-------|--------|
| **Status** | Planned |
| **Priority** | Medium |
| **Spec** | `tests/saucedemo/inventory.spec.js` (planned) |

### Steps

1. Log in and open inventory.
2. Select sort option **Price (low to high)**.
3. Verify product prices are in ascending order.

### Expected result

Products are sorted by price ascending.

---

## TC-09: Complete checkout (happy path)

| Field | Detail |
|-------|--------|
| **Status** | Planned |
| **Priority** | High |
| **Spec** | `tests/saucedemo/checkout.spec.js` (planned) |
| **Preconditions** | Logged in; at least one item in cart |

### Steps

1. Open cart and click **Checkout**.
2. Enter first name, last name, and postal code.
3. Click **Continue**.
4. Verify order overview (item, payment, shipping, total).
5. Click **Finish**.
6. Verify confirmation: *Thank you for your order!*

### Expected result

Order is placed successfully; confirmation page is shown.

---

## TC-10: Checkout with missing first name

| Field | Detail |
|-------|--------|
| **Status** | Planned |
| **Priority** | Medium |
| **Spec** | `tests/saucedemo/checkout.spec.js` (planned) |

### Steps

1. Proceed to checkout information step.
2. Leave first name empty; fill last name and postal code.
3. Click **Continue**.
4. Verify error: *Error: First Name is required*

### Expected result

Checkout does not continue; validation error is shown.

---

## Implementation order

1. **TC-01** — Login with valid credentials ← *Done*
2. **TC-02, TC-03** — Login negatives ← *Done*; TC-04 — empty credentials
3. TC-05, TC-06 — Cart
4. TC-07, TC-08 — Inventory sorting
5. TC-09, TC-10 — Checkout
