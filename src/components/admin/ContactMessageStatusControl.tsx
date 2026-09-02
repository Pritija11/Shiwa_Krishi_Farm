"use client";

import { useState, useTransition } from "react";

import { updateContactMessageStatus } from "@/app/(admin-dashboard)/admin/contact-messages/[id]/action";

type ContactMessageStatus = "NEW" | "READ" | "RESOLVED";

type ContactMessageStatusControlProps = {
  id: string;
  currentStatus: ContactMessageStatus;
};

const statusOrder: Record<ContactMessageStatus, number> = {
  NEW: 0,
  READ: 1,
  RESOLVED: 2,
};

const statusLabels: Record<ContactMessageStatus, string> = {
  NEW: "New",
  READ: "Read",
  RESOLVED: "Resolved",
};

export default function ContactMessageStatusControl({
  id,
  currentStatus,
}: ContactMessageStatusControlProps) {
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const nextStatus = getNextStatus(currentStatus);

  function handleChange(value: ContactMessageStatus) {
    if (value === currentStatus || !nextStatus || value !== nextStatus) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await updateContactMessageStatus(id, value);
        setStatus(value);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update message status."
        );
      }
    });
  }

  return (
    <div>
      <label
        htmlFor="message-status"
        className="text-xs font-medium uppercase tracking-wide text-stone-400"
      >
        Current status
      </label>

      <select
        id="message-status"
        value={status}
        disabled={isPending || status === "RESOLVED"}
        onChange={(event) =>
          handleChange(event.target.value as ContactMessageStatus)
        }
        className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-green-950 outline-none transition focus:border-green-800 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value={currentStatus}>
          {statusLabels[currentStatus]}
        </option>

        {nextStatus && (
          <option value={nextStatus}>
            {statusLabels[nextStatus]}
          </option>
        )}
      </select>

      {isPending && (
        <p className="mt-2 text-xs text-stone-500">
          Updating status...
        </p>
      )}

      {status === "RESOLVED" && !isPending && !error && (
        <p className="mt-2 text-xs text-stone-500">
          This message has been resolved and cannot be changed.
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function getNextStatus(
  currentStatus: ContactMessageStatus
): ContactMessageStatus | null {
  const next = Object.entries(statusOrder).find(
    ([, order]) => order === statusOrder[currentStatus] + 1
  );

  return next ? (next[0] as ContactMessageStatus) : null;
}