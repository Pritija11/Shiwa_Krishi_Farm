const MAX_MESSAGE_LENGTH = 3000;
const TRUNCATION_SUFFIX = "\n\n... (message truncated)";

export function sanitizeWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isWhatsAppConfigured(phone: string): boolean {
  return sanitizeWhatsAppNumber(phone).length > 0;
}

/**
 * Plain wa.me link with no prefilled message, for static "chat with us" links.
 */
export function createWhatsAppLinkUrl(phone: string): string {
  const whatsappNumber = sanitizeWhatsAppNumber(phone);

  if (!whatsappNumber) {
    throw new Error("WhatsApp number is not configured.");
  }

  return `https://wa.me/${whatsappNumber}`;
}

export function createWhatsAppUrl(phone: string, message: string) {
  const whatsappNumber = sanitizeWhatsAppNumber(phone);

  if (!whatsappNumber) {
    throw new Error("WhatsApp number is not configured.");
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

/**
 * Joins non-empty message lines and applies a defensive length cap so an
 * unusually long form submission can never produce a broken/unopenable
 * wa.me link.
 */
export function buildWhatsAppMessage(
  lines: Array<string | false | null | undefined>
): string {
  const message = lines.filter(Boolean).join("\n");

  if (message.length <= MAX_MESSAGE_LENGTH) {
    return message;
  }

  return (
    message.slice(0, MAX_MESSAGE_LENGTH - TRUNCATION_SUFFIX.length) +
    TRUNCATION_SUFFIX
  );
}

/**
 * Opens a blank tab synchronously (must be called directly within a user
 * gesture, before any `await`) so it can be navigated to the WhatsApp URL
 * later without being blocked by popup blockers.
 */
export function openBlankWhatsAppWindow(): Window | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.open("", "_blank");
}

export function redirectToWhatsApp(target: Window | null, url: string): void {
  if (target && !target.closed) {
    target.location.href = url;
  } else {
    window.location.href = url;
  }
}

export function closeWhatsAppWindow(target: Window | null): void {
  if (target && !target.closed) {
    target.close();
  }
}
