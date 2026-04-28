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

const ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL ?? "",
  password: process.env.TEST_ADMIN_PASSWORD ?? "",
};


const createdAnnouncementTitles: string[] = [];

test.describe.configure({ mode: "serial" });

async function selectAnnouncementShop(page: Page) {
  // The "Target Audience *" label only renders for authorized users (admin/shopowner)
  const shopLabel = page.getByText("Target Audience *");
  try {
    await shopLabel.waitFor({ state: "visible", timeout: 5000 });
  } catch {
    // If not visible, we assume it's not required for this user role
    return;
  }

  // The dropdown trigger is scoped inside the section containing the label.
  const shopSection = page.locator("div.group").filter({ has: shopLabel }).first();
  const dropdownTrigger = shopSection.locator("div[class*='cursor-pointer']").first();
  await dropdownTrigger.click();

  // Scope option search to the absolute-positioned dropdown inside shopSection.
  const dropdownContainer = shopSection.locator("div[class*='absolute']").first();
  const shopOptions = dropdownContainer
    .locator("div[class*='cursor-pointer']")
    .filter({ hasNot: page.getByText(/Global Broadcast/) });

  // If we can't find a shop option, throw so the test fails explicitly
  await shopOptions.first().waitFor({ state: "visible", timeout: 5000 });
  await shopOptions.first().click();
}

async function createAnnouncement(page: Page, title: string, content: string) {
  await expect(page.getByPlaceholder("Enter announcement headline...")).toBeVisible({ timeout: 10000 });
  await selectAnnouncementShop(page);
  await page.getByPlaceholder("Enter announcement headline...").fill(title);
  await page.getByPlaceholder("Compose your message here...").fill(content);
  await page.getByRole("button", { name: "+ Publish Post" }).click();
  // resetForm() clears the title only on successful POST — if it stays filled, the POST failed
  await expect(page.getByPlaceholder("Enter announcement headline...")).toHaveValue("", { timeout: 15000 });
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

  const titleField = page.getByPlaceholder("Enter announcement headline...");
  const contentField = page.getByPlaceholder("Compose your message here...");
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
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByRole("heading", { name: createdTitle })).toHaveCount(0, { timeout: 10000 });
  }

  createdAnnouncementTitles.length = 0;
});

// ─── US4-6: Admin want to create a new announcement ─────────────────────────────────────────
test('US4-6: Admin create a new announcement', async ({ page }) => {
  const title = `us4-6-${Date.now()}`;
  const content = 'admin create test';

  await login(page, ADMIN.email, ADMIN.password);
  await page.goto(`${BASE_URL}/announcements`);

  await createAnnouncement(page, title, content);

  await expect(page.getByRole('heading', { name: title })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(content)).toBeVisible();
});

// ─── US4-8: Admin want to edit an announcement ─────────────────────────────────────────
test('US4-8: Admin can edit an announcement', async ({ page }) => {
  const originalTitle = `us4-8-${Date.now()}`;
  const updatedTitle = `us4-8-updated-${Date.now()}`;
  const originalContent = `admin-original-content-${Date.now()}`;
  const updatedContent = `admin-updated-content-${Date.now()}`;

  expect(updatedTitle).not.toBe(originalTitle);
  expect(updatedContent).not.toBe(originalContent);

  await login(page, ADMIN.email, ADMIN.password);
  await page.goto(`${BASE_URL}/announcements`);
  await createAnnouncement(page, originalTitle, originalContent);

  const announcementCard = page.getByRole('article').filter({ has: page.getByRole('heading', { name: originalTitle }) }).first();
  await announcementCard.getByRole('button', { name: 'Edit' }).click();

  const titleField = page.getByPlaceholder('Enter announcement headline...');
  const contentField = page.getByPlaceholder('Compose your message here...');

  await expect(titleField).toHaveValue(originalTitle);
  await expect(contentField).toHaveValue(originalContent);

  await titleField.fill(updatedTitle);
  await contentField.fill(updatedContent);
  await page.getByRole('button', { name: '✓ Save Changes' }).click();

  replaceTrackedTitle(originalTitle, updatedTitle);

  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  await expect(page.getByRole('heading', { name: originalTitle })).toHaveCount(0);
  await expect(page.getByText(updatedContent)).toBeVisible();
  await expect(page.getByText(originalContent)).toHaveCount(0);
});

// ─── US4-7: Admin want to view announcement ─────────────────────────────────────────
test('US4-7: Admin can view all announcements created in this test', async ({ page }) => {
  await login(page, ADMIN.email, ADMIN.password);
  await page.goto(`${BASE_URL}/announcements`);

  for (const createdTitle of createdAnnouncementTitles) {
    await expect(page.getByRole('heading', { name: createdTitle })).toBeVisible({ timeout: 10000 });
  }
});

// ─── US4-9: Admin want to delete an announcement ─────────────────────────────────────────
test('US4-9: Admin deletes announcements created in this test', async ({ page }) => {
  await login(page, ADMIN.email, ADMIN.password);
  await page.goto(`${BASE_URL}/announcements`);

  expect(createdAnnouncementTitles.length).toBeGreaterThan(0);

  for (const createdTitle of [...createdAnnouncementTitles]) {
    const heading = page.getByRole('heading', { name: createdTitle }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const card = page.getByRole('article').filter({ hasText: createdTitle }).first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();

    const deleteButton = card.getByRole('button', { name: 'Delete' });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmButton = page.getByRole('button', { name: 'Confirm' });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    await expect(page.getByRole('heading', { name: createdTitle })).toHaveCount(0, { timeout: 10000 });
  }

  createdAnnouncementTitles.length = 0;
});

