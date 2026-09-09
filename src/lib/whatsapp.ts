export function createWhatsAppUrl(
  phone: string,
  message: string
) {
  const whatsappNumber = phone.replace(/\D/g, "");

  if (!whatsappNumber) {
    throw new Error("WhatsApp number is not configured.");
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}