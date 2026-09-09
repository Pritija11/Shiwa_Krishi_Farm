"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteSubscription } from "@/app/(admin-dashboard)/admin/subscriptions/action";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type DeleteSubscriptionButtonProps = {
  subscriptionId: string;
  customerName: string;
};

export default function DeleteSubscriptionButton({
  subscriptionId,
  customerName,
}: DeleteSubscriptionButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setError(null);
  }

  async function handleConfirm() {
    setIsPending(true);
    setError(null);

    const result = await deleteSubscription(subscriptionId);

    if (!result.success) {
      setError(result.error ?? "Failed to delete subscription.");
      setIsPending(false);
      return;
    }

    setOpen(false);
    setIsPending(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-800"
        aria-label="Delete subscription"
        title="Delete subscription"
      >
        <Trash2 size={16} strokeWidth={1.8} />
        Delete
      </button>

      {open && (
        <ConfirmDialog
          title="Delete subscription"
          description={
            <>
              Are you sure you want to permanently delete the
              cancelled subscription for{" "}
              <span className="font-medium text-green-950">
                {customerName}
              </span>
              ? This cannot be undone.
            </>
          }
          errorMessage={error}
          onClose={closeDialog}
          onConfirm={handleConfirm}
          confirmLabel="Delete"
          pendingLabel="Deleting..."
          isPending={isPending}
          confirmVariant="danger"
        />
      )}
    </>
  );
}
