/*
 * In-memory login rate limiter, keyed by client IP + attempted phone
 * number. Resets on server restart and is per-process only (not shared
 * across multiple instances) — acceptable for this app's single-instance
 * deployment, but worth revisiting with a shared store (e.g. Redis) if
 * that ever changes.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

type AttemptRecord = {
  count: number;
  windowStart: number;
  lockedUntil: number | null;
};

const attempts = new Map<string, AttemptRecord>();

export function checkLoginRateLimit(key: string): {
  allowed: boolean;
  retryAfterMinutes?: number;
} {
  const record = attempts.get(key);

  if (!record) {
    return { allowed: true };
  }

  const now = Date.now();

  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      return {
        allowed: false,
        retryAfterMinutes: Math.ceil(
          (record.lockedUntil - now) / 60000
        ),
      };
    }

    attempts.delete(key);
    return { allowed: true };
  }

  if (now - record.windowStart > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLoginAttempt(key: string) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    attempts.set(key, {
      count: 1,
      windowStart: now,
      lockedUntil: null,
    });
    return;
  }

  const count = record.count + 1;

  attempts.set(key, {
    count,
    windowStart: record.windowStart,
    lockedUntil: count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : null,
  });
}

export function clearLoginAttempts(key: string) {
  attempts.delete(key);
}
