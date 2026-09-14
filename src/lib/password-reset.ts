import { randomBytes, createHash } from "crypto";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * The raw token is emailed to the admin and never stored; only its hash is
 * persisted, so a leaked database can't be used to forge reset links.
 */
export function generateResetToken() {
  const rawToken = randomBytes(32).toString("hex");

  return {
    rawToken,
    tokenHash: hashResetToken(rawToken),
  };
}

export function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
