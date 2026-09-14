"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteEnquiry } from "@/app/admin/enquiries/[id]/action";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type DeleteEnquiryButtonProps = {
  enquiryId: string;
  customerName: string;
};

export default function DeleteEnquiryButton({
  enquiryId,
  customerName,
}: DeleteEnquiryButtonProps) {
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
      await deleteEnquiry(enquiryId);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete enquiry."
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
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-800"
        aria-label="Delete enquiry"
        title="Delete enquiry"
      >
        <Trash2 size={16} strokeWidth={1.8} />
        Delete
      </button>

      {open && (
        <ConfirmDialog
          title="Delete enquiry"
          description={
            <>
              Are you sure you want to permanently delete the
              cancelled enquiry from{" "}
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
