"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/admin/ConfirmDialog";

type ArchiveGalleryButtonProps = {
  id: string;
  title: string;
  isActive: boolean;
};

export default function ArchiveGalleryButton({
  id,
  title,
  isActive,
}: ArchiveGalleryButtonProps) {
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${isActive ? "archive" : "restore"} gallery item.`
        );
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update gallery item."
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
        className={`text-xs font-medium transition ${
          isActive
            ? "text-red-600 hover:text-red-800"
            : "text-green-700 hover:text-green-900"
        }`}
      >
        {isActive ? "Archive" : "Restore"}
      </button>

      {open && (
        <ConfirmDialog
          title={isActive ? "Archive gallery item" : "Restore gallery item"}
          description={
            isActive ? (
              <>
                Are you sure you want to archive{" "}
                <span className="font-medium text-green-950">
                  {title}
                </span>
                ? It will be hidden from the website but you can
                restore it anytime.
              </>
            ) : (
              <>
                Are you sure you want to restore{" "}
                <span className="font-medium text-green-950">
                  {title}
                </span>
                ? It will become visible on the website again.
              </>
            )
          }
          errorMessage={error}
          onClose={closeDialog}
          onConfirm={handleConfirm}
          confirmLabel={isActive ? "Archive" : "Restore"}
          pendingLabel={isActive ? "Archiving..." : "Restoring..."}
          isPending={isPending}
        />
      )}
    </>
  );
}
