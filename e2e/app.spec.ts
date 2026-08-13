import { test, expect } from "@playwright/test";
import path from "node:path";

/**
 * Smoke test for the core authenticated flow:
 * create an application and upload a resume attachment.
 */
test("create application and upload resume attachment", async ({ page }) => {
  const stamp = Date.now();
  const company = `E2E Corp ${stamp}`;
  const position = `E2E Engineer ${stamp}`;
  let appId: string | null = null;

  try {
    // Dashboard is behind auth — storageState from authenticated.setup.ts
    await page.goto("/");
    await expect(page.getByText("Welcome back")).toBeVisible();

    // Go to the new application form
    await page.getByRole("link", { name: "New Application" }).click();
    await expect(page.getByRole("heading", { name: "New Application" })).toBeVisible();

    // Fill the required fields
    await page.getByPlaceholder("e.g., Google").fill(company);
    await page.getByPlaceholder("e.g., Senior Frontend Engineer").fill(position);

    // Select a resume file for the Resume category (default)
    await page.locator('input[type="file"]').setInputFiles(
      path.join(__dirname, "fixtures/resume.pdf")
    );
    await expect(page.getByText(new RegExp(`Resume selected: resume\\.pdf`))).toBeVisible();

    // Submit
    await page.getByRole("button", { name: "Save Application" }).click();

    // Lands back on the dashboard and the new application appears
    await page.waitForURL("**/");
    await expect(page.getByText(company)).toBeVisible({ timeout: 15_000 });

    // Open the application detail page
    await page.getByRole("link", { name: new RegExp(company) }).click();
    await page.waitForURL(/\/applications\/[^/]+$/);
    appId = new URL(page.url()).pathname.split("/").pop()!;

    await expect(page.getByRole("heading", { name: position })).toBeVisible();

    // The uploaded resume is listed under Attachments
    const attachments = page.locator("section", { hasText: "Attachments" });
    await expect(attachments).toBeVisible();
    await expect(attachments.getByText("resume.pdf", { exact: true })).toBeVisible();
    await expect(attachments.getByText(/Resume already uploaded: resume\.pdf/)).toBeVisible();
  } finally {
    // Clean up the test application via the authenticated API
    if (appId) {
      await page.request.delete(`/api/applications/${appId}`).catch(() => {});
    }
  }
});
