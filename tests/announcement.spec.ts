import { test, expect, Page } from "@playwright/test";
import { login, goToShop } from "./testfunction";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

const CUSTOMER = {
  email: process.env.TEST_CUSTOMER_EMAIL ?? "",
  password: process.env.TEST_CUSTOMER_PASSWORD ?? "",
};

const SHOP_OWNER = {
	email: process.env.TEST_SHOP_OWNER_EMAIL ?? "",
	password: process.env.TEST_SHOP_OWNER_PASSWORD ?? "",
};

const createdAnnouncementTitles: string[] = [];

test.describe.configure({ mode: "serial" });

async function createAnnouncement(page: Page, title: string, content: string) {
  await page.getByPlaceholder("Enter announcement title...").fill(title);
  await page.getByPlaceholder("Write your announcement details here...").fill(content);
  await page.getByRole("button", { name: "+ Publish Post" }).click();
  createdAnnouncementTitles.push(title);
}

function replaceTrackedTitle(oldTitle: string, newTitle: string) {
  const index = createdAnnouncementTitles.indexOf(oldTitle);
  if (index !== -1) createdAnnouncementTitles[index] = newTitle;
}

// ─── US4-1: Shop owner create a new announcement ─────────────────────────────────────────
test('US4-1: Shop owner create a new announcement', async ({ page }) => {
  const title = `us4-1-${Date.now()}`;
  const content = 'for create test';

  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await goToShop(page);
  await page.getByRole('link', { name: 'Announcement' }).click();

  await createAnnouncement(page, title, content);

  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  await goToShop(page);
  await page.getByRole('button', { name: /\d+\s+Announcements/i }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.getByText(content)).toBeVisible();
});

// ─── US4-2: Shop owner want to view all announcements ─────────────────────────────────────────
test('US4-2: Shop owner want to view all announcements', async ({ page }) => {
  const titleOne = `us4-2-a-${Date.now()}`;
  const titleTwo = `us4-2-b-${Date.now()}`;

  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await goToShop(page);
  await page.getByRole('button', { name: 'Announcements — Manage Posts —' }).click();

  await createAnnouncement(page, titleOne, "first post for view-all test");
  await expect(page.getByRole("heading", { name: titleOne })).toBeVisible();
  await createAnnouncement(page, titleTwo, "second post for view-all test");
  await expect(page.getByRole("heading", { name: titleTwo })).toBeVisible();
});

// ─── US4-3: Shop owner want to edit an existing announcement ─────────────────────────────────────────
test('US4-3: Shop owner want to edit an existing announcement', async ({ page }) => {
  const originalTitle = `us4-3-${Date.now()}`;
  const updatedTitle = `us4-3-updated-${Date.now()}`;
  const originalContent = `original-content-${Date.now()}`;
  const updatedContent = `updated-content-${Date.now()}`;

  expect(updatedTitle).not.toBe(originalTitle);
  expect(updatedContent).not.toBe(originalContent);

  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await page.getByRole('link', { name: 'Announcement' }).click();
  await createAnnouncement(page, originalTitle, originalContent);

  await expect(page.getByRole("heading", { name: originalTitle })).toBeVisible();
  await expect(page.getByText(originalContent)).toBeVisible();

  const announcementCard = page.getByRole("article").filter({ has: page.getByRole("heading", { name: originalTitle }) }).first();
  await announcementCard.getByRole("button", { name: "Edit" }).click();

  const titleField = page.getByPlaceholder("Enter announcement title...");
  const contentField = page.getByPlaceholder("Write your announcement details here...");
  await expect(titleField).toHaveValue(originalTitle);
  await expect(contentField).toHaveValue(originalContent);

  await titleField.fill(updatedTitle);
  await contentField.fill(updatedContent);
  await page.getByRole("button", { name: "✓ Save Changes" }).click();

  replaceTrackedTitle(originalTitle, updatedTitle);

  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();
  await expect(page.getByRole("heading", { name: originalTitle })).toHaveCount(0);
  await expect(page.getByText(updatedContent)).toBeVisible();
  await expect(page.getByText(originalContent)).toHaveCount(0);
});

// ─── US4-5: User want to view announcements from a specific shop ─────────────────────────────────────────
test('US4-5: User can view all announcements created in this test', async ({ browser }) => {
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  await login(userPage, CUSTOMER.email, CUSTOMER.password);
  await goToShop(userPage);
  await userPage.getByRole('button', { name: /\d+\s+Announcements/i }).click();

  const orderedTitles = [...createdAnnouncementTitles].reverse();
  for (let i = 0; i < orderedTitles.length; i++) {
    await expect(userPage.getByRole('heading', { name: orderedTitles[i] })).toBeVisible();

    if (i < orderedTitles.length - 1) {
      await userPage.getByRole('button', { name: '›' }).click();
    }
  }


  await userContext.close();
});


// ─── US4-4: Shop owner want to delete announcements ─────────────────────────────────────────
test('US4-4: Shop owner deletes announcement created in this test', async ({ page }) => {
  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await page.goto(`${BASE_URL}/announcements`);

  expect(createdAnnouncementTitles.length).toBeGreaterThan(0);

  for (const createdTitle of [...createdAnnouncementTitles]) {
    const heading = page.getByRole("heading", { name: createdTitle }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const card = page
      .getByRole("article")
      .filter({ hasText: createdTitle })
      .first();

    await card.scrollIntoViewIfNeeded();

    await card.hover();
    await card.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Confirm Delete" }).click();
    await expect(page.getByRole("heading", { name: createdTitle })).toHaveCount(0, { timeout: 10000 });
  }

  createdAnnouncementTitles.length = 0;
});

