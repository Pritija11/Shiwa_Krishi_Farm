/*
 * In-memory rate limiter for password reset requests, keyed by client IP +
 * requested phone number. Resets on server restart and is per-process only
 * (not shared across multiple instances) — acceptable for this app's
 * single-instance deployment, matching the login rate limiter's tradeoffs.
 */

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000;

type AttemptRecord = {
  count: number;
  windowStart: number;
};

const attempts = new Map<string, AttemptRecord>();

export function checkPasswordResetRateLimit(key: string): {
  allowed: boolean;
  retryAfterMinutes?: number;
} {
  const record = attempts.get(key);

  if (!record) {
    return { allowed: true };
  }

  const now = Date.now();

  if (now - record.windowStart > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterMinutes: Math.ceil(
        (record.windowStart + WINDOW_MS - now) / 60000
      ),
    };
  }

  return { allowed: true };
}

export function recordPasswordResetAttempt(key: string) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    attempts.set(key, {
      count: 1,
      windowStart: now,
    });
    return;
  }

  attempts.set(key, {
    count: record.count + 1,
    windowStart: record.windowStart,
  });
}
