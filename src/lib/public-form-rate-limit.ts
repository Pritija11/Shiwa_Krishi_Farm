/*
 * In-memory rate limiter for public form endpoints (order enquiries, milk
 * subscriptions, contact messages), keyed by client IP + form name. Fixed
 * window: allows up to `max` submissions per `windowMs`, then blocks until
 * the window rolls over. Per-process only (not shared across instances) —
 * same tradeoff as login-rate-limit.ts, acceptable for this app's
 * single-instance deployment.
 *
 * This guards against scripted spam (hundreds of fake submissions in a
 * burst), not genuine concurrent traffic from different real customers —
 * the limit is per IP, so unrelated visitors never affect each other.
 */

type WindowRecord = {
  count: number;
  windowStart: number;
};

const windows = new Map<string, WindowRecord>();

export function checkPublicFormRateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): { allowed: boolean; retryAfterMinutes?: number } {
  const now = Date.now();
  const record = windows.get(key);

  if (!record || now - record.windowStart > windowMs) {
    windows.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (record.count >= max) {
    return {
      allowed: false,
      retryAfterMinutes: Math.ceil(
        (record.windowStart + windowMs - now) / 60000
      ),
    };
  }

  record.count += 1;
  return { allowed: true };
}

export function getClientIpFromRequest(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}
