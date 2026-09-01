export const subscriptionTransitions = {
  PENDING: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["PAUSED", "CANCELLED"],
  PAUSED: ["ACTIVE", "CANCELLED"],
  CANCELLED: [],
} as const;

export type SubscriptionStatus = keyof typeof subscriptionTransitions;

export function getAllowedNextStatuses(
  status: SubscriptionStatus
): readonly string[] {
  return subscriptionTransitions[status];
}