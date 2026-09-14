"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteContactMessage } from "@/app/(admin-dashboard)/admin/contact-messages/[id]/action";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type DeleteContactMessageButtonProps = {
  messageId: string;
  customerName: string;
};

export default function DeleteContactMessageButton({
  messageId,
  customerName,
}: DeleteContactMessageButtonProps) {
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

    try {
      await deleteContactMessage(messageId);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete message."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:text-red-800"
        aria-label="Delete message"
        title="Delete message"
      >
        <Trash2 size={16} strokeWidth={1.8} />
        Delete
      </button>

      {open && (
        <ConfirmDialog
          title="Delete message"
          description={
            <>
              Are you sure you want to permanently delete the
              resolved message from{" "}
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
