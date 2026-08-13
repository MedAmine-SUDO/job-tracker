import { clerkSetup } from "@clerk/testing/playwright";
import { createClerkClient } from "@clerk/backend";
import { test as setup, expect } from "@playwright/test";

setup.describe.configure({ mode: "serial" });

setup("global setup", async () => {
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    process.env.CLERK_PUBLISHABLE_KEY;
  expect(publishableKey, "Set CLERK_PUBLISHABLE_KEY in .env.local").toBeTruthy();

  await clerkSetup({ dotenv: false, publishableKey });

  expect(
    process.env.E2E_CLERK_USER_EMAIL,
    "Set E2E_CLERK_USER_EMAIL in .env.local, e.g. jobtracker-e2e+clerk_test@example.com"
  ).toBeTruthy();
  expect(
    process.env.E2E_CLERK_USER_PASSWORD,
    "Set E2E_CLERK_USER_PASSWORD in .env.local"
  ).toBeTruthy();
  expect(process.env.CLERK_SECRET_KEY, "Set CLERK_SECRET_KEY in .env.local").toBeTruthy();

  const client = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  // Ensure a dedicated test user exists. The +clerk_test email suffix
  // makes Clerk use test mode (verification codes always 424242, no real emails).
  const { data: users } = await client.users.getUserList({
    emailAddress: [process.env.E2E_CLERK_USER_EMAIL!],
  });

  if (users.length === 0) {
    await client.users.createUser({
      emailAddress: [process.env.E2E_CLERK_USER_EMAIL!],
      password: process.env.E2E_CLERK_USER_PASSWORD!,
      firstName: "E2E",
      lastName: "Tester",
    });
  } else {
    await client.users.updateUser(users[0].id, {
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    });
  }
});
