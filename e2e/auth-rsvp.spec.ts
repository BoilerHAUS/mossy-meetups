/**
 * E2E: Magic-link auth → RSVP flow
 *
 * Default run path:
 *   - npm run test:e2e
 *
 * That command boots a local Postgres + MailHog stack, resets the test DB,
 * starts the app with E2E-specific env vars, and then runs Playwright.
 */
import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.E2E_TEST_EMAIL ?? "e2e@example.com";
const MAILHOG_API_URL = process.env.E2E_MAILHOG_API_URL ?? "http://127.0.0.1:8026/api/v2/messages";

type MailhogMessage = {
  Content?: {
    Headers?: Record<string, string[]>;
    Body?: string;
  };
  MIME?: {
    Parts?: Array<{
      Body?: string;
    }>;
  };
};

async function fetchMailhogMessages() {
  const response = await fetch(MAILHOG_API_URL);
  if (!response.ok) {
    throw new Error(`MailHog request failed with ${response.status}`);
  }

  const json = await response.json() as { items?: MailhogMessage[] };
  return json.items ?? [];
}

function extractMagicLink(message: MailhogMessage) {
  const candidates = [
    message.Content?.Body,
    ...(message.MIME?.Parts?.map((part) => part.Body) ?? []),
    JSON.stringify(message),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = String(candidate)
      .replace(/=\r?\n/g, "")
      .replace(/=([A-F0-9]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&amp;/g, "&");
    const match = normalized.match(/https?:\/\/[^\s"]+\/api\/auth\/callback\/email[^\s"]+/);
    if (match) {
      return match[0];
    }
  }

  throw new Error("Magic link not found in MailHog message");
}

async function waitForMagicLink(previousCount: number) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const messages = await fetchMailhogMessages();
    if (messages.length > previousCount) {
      return extractMagicLink(messages[messages.length - 1]);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Timed out waiting for magic link email");
}

test.describe("Magic-link auth → RSVP flow", () => {
  test("unauthenticated user is redirected to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page renders email input and sign-in button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /send magic link/i })).toBeVisible();
  });

  test("submitting the login form shows a confirmation message", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email/i }).fill(TEST_EMAIL);
    await page.getByRole("button", { name: /send magic link/i }).click();
    await expect(page.getByText(/check your email/i)).toBeVisible({ timeout: 10_000 });
  });

  test("authenticated user can follow the magic link and RSVP to an event", async ({ page, context }) => {
    const previousMessages = await fetchMailhogMessages();

    await page.goto("/login");
    await page.getByRole("textbox", { name: /email/i }).fill(TEST_EMAIL);
    await page.getByRole("button", { name: /send magic link/i }).click();
    await expect(page.getByText(/check your email/i)).toBeVisible({ timeout: 10_000 });

    const magicLinkUrl = await waitForMagicLink(previousMessages.length);
    await page.goto(magicLinkUrl);

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/seeded spring camp/i)).toBeVisible();

    await page.getByRole("link", { name: /details/i }).click();
    await expect(page).toHaveURL(/\/events\//);

    await page.getByRole("button", { name: "Going" }).click();
    await expect(page.getByText(/^1 response$/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Going" })).toBeVisible();

    await context.clearCookies();
  });
});
