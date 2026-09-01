"use client";

import { useState, useTransition } from "react";
import { updateSubscriptionStatus } from "@/app/(admin-dashboard)/admin/subscriptions/action";

type SubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "PAUSED"
  | "CANCELLED";

type SubscriptionStatusControlProps = {
  subscriptionId: string;
  currentStatus: SubscriptionStatus;
};

const validTransitions: Record<
  SubscriptionStatus,
  SubscriptionStatus[]
> = {
  PENDING: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["PAUSED", "CANCELLED"],
  PAUSED: ["ACTIVE", "CANCELLED"],
  CANCELLED: [],
};

const statusLabels: Record<SubscriptionStatus, string> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  PAUSED: "Paused",
  CANCELLED: "Cancelled",
};

export default function SubscriptionStatusControl({
  subscriptionId,
  currentStatus,
}: SubscriptionStatusControlProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<SubscriptionStatus>(currentStatus);

  const [isPending, startTransition] = useTransition();

  const allowedStatuses = validTransitions[currentStatus];

  const hasChanged = selectedStatus !== currentStatus;

  function handleUpdate() {
    if (!hasChanged || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await updateSubscriptionStatus(
        subscriptionId,
        selectedStatus
      );

      if (!result.success) {
        setSelectedStatus(currentStatus);
        alert(result.error);
        return;
      }

      window.location.reload();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedStatus}
        onChange={(event) =>
          setSelectedStatus(
            event.target.value as SubscriptionStatus
          )
        }
        disabled={currentStatus === "CANCELLED" || isPending}
        className="rounded-lg border border-stone-200 bg-[#F8F5ED] px-3 py-2 text-sm text-green-950 outline-none transition focus:border-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value={currentStatus}>
          {statusLabels[currentStatus]}
        </option>

        {allowedStatuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>

      {hasChanged && (
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isPending}
          className="rounded-lg bg-green-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      )}
    </div>
  );
}