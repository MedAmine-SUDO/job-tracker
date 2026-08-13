import { clerk } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import path from "node:path";

setup.describe.configure({ mode: "serial" });

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  await clerk.signIn({
    page,
    emailAddress: process.env.E2E_CLERK_USER_EMAIL!,
  });

  // The helper signs the session in but does not navigate. The dashboard
  // is protected; reaching it proves auth worked.
  await page.goto("/");
  await page.waitForSelector("text=Welcome back");

  await page.context().storageState({ path: authFile });
});
