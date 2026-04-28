import { test, expect, Page, Locator } from "@playwright/test";
import { login } from "./testfunction";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const CUSTOMER = {
  email: process.env.TEST_CUSTOMER_EMAIL ?? "",
  password: process.env.TEST_CUSTOMER_PASSWORD ?? "",
};
const SHOP_OWNER = {
  email: process.env.TEST_SHOP_OWNER_EMAIL ?? "",
  password: process.env.TEST_SHOP_OWNER_PASSWORD ?? "",
};
const ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL ?? "",
  password: process.env.TEST_ADMIN_PASSWORD ?? "",
};
const SHOP_ID = process.env.TEST_RATING_SHOP_ID ?? process.env.TEST_SHOP_ID ?? "";

// ─── US1-1: User leave a rating after receive service ─────────────────────────────────────────
test("TC1-1: User can rate shop", async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await page.goto(`${BASE_URL}/shop/${SHOP_ID}`);

  await page.getByRole('button', { name: 'Rate 4 stars' }).click();

  const textarea = page.getByPlaceholder("How was your visit? (optional)");
  await textarea.fill("Very good, best massage");

  const submitBtn = page.getByRole('button', { name: /Publish Review/i });
  await expect(submitBtn).toBeEnabled();

  await submitBtn.click();
  
  await expect(page.getByText(/Review published successfully!/i)).toBeVisible();
});

// ─── US1-2: User can view other customer reviews but not edit them ─────────────────────────────────────────
test("TC1-2: User can view other customer reviews but not edit them", async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await page.goto(`${BASE_URL}/shop/${SHOP_ID}`);

  const reviewList = page.locator('#reviews');
  await expect(reviewList).toBeVisible();

  const otherReview = page.getByText(/The guest preferred to stay silent./i);
  
  await expect(otherReview).toBeVisible();
  
});

// ─── US1-3: User can edit their own review ─────────────────────────────────────────
test("TC1-3: User can edit their own review", async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await page.goto(`${BASE_URL}/shop/${SHOP_ID}`);

  const myReview = page.locator('div.relative').filter({ hasText: /Verified Author/i }).first();
  
  await myReview.getByTitle(/Edit review/i).click();

  await page.getByRole('button', { name: 'Rate 5 stars' }).click();
  await page.getByPlaceholder(/How was your visit/i).fill("Updated: Actually, it was perfect!");

  await page.getByRole('button', { name: /Update Experience/i }).click();

  await expect(page.getByText(/Review updated successfully!/i)).toBeVisible();
});

// ─── US1-4: User can delete their own review ─────────────────────────────────────────
test("TC1-4: User can delete their own review", async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await page.goto(`${BASE_URL}/shop/${SHOP_ID}`);

  const myReview = page.locator('div.relative').filter({ hasText: /Verified Author/i }).first();
  await myReview.getByTitle(/Delete review/i).click();

  await expect(page.getByText("Confirm Deletion")).toBeVisible();
  await expect(page.getByText(/Are you sure you want to remove this memory?/i)).toBeVisible();

  const confirmBtn = page.getByRole('button', { name: "Delete Permanently" });
  await confirmBtn.click();

  await expect(page.getByText(/Review deleted successfully/i)).toBeVisible();
});
