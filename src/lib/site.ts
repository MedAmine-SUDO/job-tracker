export const SITE_NAME = "Job Tracker";
export const SITE_TAGLINE = "Track applications, interviews & offers";
export const SITE_DESCRIPTION =
  "Organize your job hunt. Track applications, interviews, and offers in one place — attach resumes, follow your pipeline, and land the role.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const SITE_KEYWORDS = [
  "job tracker",
  "job application tracker",
  "job hunt organizer",
  "interview tracker",
  "offer tracker",
  "career",
  "job search",
];
