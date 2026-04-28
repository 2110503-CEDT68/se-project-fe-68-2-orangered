import { expect, Page, Locator } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const SHOP_ID = process.env.TEST_SHOP_ID ?? "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/signin`);
  await page.getByTestId("email-input").fill(email);
  await page.getByTestId("password-input").fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  
  // Escape special characters in BASE_URL for RegExp
  const escapedBaseUrl = BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page.waitForURL(new RegExp(`^${escapedBaseUrl}/?$`), { timeout: 45000 });
}

export async function goToShop(page: Page) {
  await page.goto(`${BASE_URL}/shop/${SHOP_ID}`);
  // Works for both roles: customer sees textarea, shop owner sees sidebar first
  await page
    .getByPlaceholder("Compose your message...")
    .or(page.getByText("Guest Inquiries"))
    .first()
    .waitFor({ timeout: 10000 });
  // Wait for Pusher channel subscription if the chat interface is visible.
  // We use a try-catch to avoid failing navigation if Pusher is just slow,
  // as downstream actions have their own retry/timeout logic.
  const textarea = page.getByPlaceholder("Compose your message...");
  if (await textarea.isVisible()) {
    await page.locator('[data-pusher-ready="true"]').waitFor({ timeout: 7000 }).catch(() => {});
  }
}

// Wait for Pusher to replace the temp ID with the real server ID before acting.
// Must use the real ID — proceeding with a temp ID causes a race condition where
// a late receiveMessage event un-does any optimistic delete/edit.
export async function sendAndConfirm(page: Page, text: string) {
  await page.getByPlaceholder("Compose your message...").fill(text);
  await page.getByRole("button", { name: "Send" }).click();
  await page
    .locator('[data-msg-id]:not([data-msg-id^="temp-"])')
    .filter({ hasText: text })
    .waitFor({ timeout: 30000 });
}

// Returns the last bubble containing the text (most recently sent)
export function getBubble(page: Page, text: string): Locator {
  return page
    .locator('[class*="group/bubble"]')
    .filter({ hasText: text })
    .last();
}

export async function readAndAgreeToTos(page: Page) {
  await page.getByRole('button', { name: 'Terms of Service' }).click();

  const tosContent = page.locator('.custom-scrollbar');

  await tosContent.evaluate((el:any) => {
    el.scrollTop = el.scrollHeight;
  });

  const agreeBtn = page.getByRole('button', { name: 'Agree & Close' });
  await expect(agreeBtn).toBeEnabled();
  await agreeBtn.click();
}
