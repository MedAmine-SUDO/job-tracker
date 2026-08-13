/**
 * Upload constraints shared by the client UI and the server API route,
 * so allowed file types can never drift between the two.
 */

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

export const ALLOWED_ATTACHMENT_MIMES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

export const ATTACHMENT_ACCEPT =
  ".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.gif,.webp,.svg";
