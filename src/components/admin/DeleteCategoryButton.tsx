"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/admin/ConfirmDialog";

type DeleteCategoryButtonProps = {
  id: string;
  name: string;
};

export default function DeleteCategoryButton({
  id,
  name,
}: DeleteCategoryButtonProps) {
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
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category.");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete category."
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
          title="Delete category"
          description={
            <>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-green-950">
                {name}
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
