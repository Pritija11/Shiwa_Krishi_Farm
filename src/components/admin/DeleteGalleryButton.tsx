"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/admin/ConfirmDialog";

type DeleteGalleryButtonProps = {
  id: string;
  title: string;
};

export default function DeleteGalleryButton({
  id,
  title,
}: DeleteGalleryButtonProps) {
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
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete gallery item."
        );
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete gallery item."
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
        className="text-xs font-medium text-red-600 transition hover:text-red-800"
      >
        Delete
      </button>

      {open && (
        <ConfirmDialog
          title="Delete gallery item"
          description={
            <>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-green-950">
                {title}
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
