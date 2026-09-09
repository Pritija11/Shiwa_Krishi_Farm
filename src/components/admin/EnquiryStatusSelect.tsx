"use client";

import { useState, useTransition } from "react";

import { updateEnquiryStatus } from "@/app/admin/enquiries/[id]/action";

type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

type EnquiryStatusSelectProps = {
  enquiryId: string;
  currentStatus: EnquiryStatus;
};

export default function EnquiryStatusSelect({
  enquiryId,
  currentStatus,
}: EnquiryStatusSelectProps) {
  const [status, setStatus] = useState<EnquiryStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const previousStatus = status;
    const newStatus = event.target.value as EnquiryStatus;

    setStatus(newStatus);
    setError(null);

    startTransition(async () => {
      try {
        await updateEnquiryStatus(enquiryId, newStatus);
      } catch (err) {
        setStatus(previousStatus);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update status."
        );
      }
    });
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={handleChange}
          disabled={isPending}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-green-950 outline-none transition focus:border-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {isPending && (
          <span className="text-xs text-stone-400">Updating...</span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}