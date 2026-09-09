export const contactMessageStatusOrder = {
  NEW: 0,
  READ: 1,
  RESOLVED: 2,
} as const;

export type ContactMessageStatus = keyof typeof contactMessageStatusOrder;
