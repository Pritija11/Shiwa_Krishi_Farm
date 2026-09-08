"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ArchiveGalleryButtonProps = {
  id: string;
  isActive: boolean;
};

export default function ArchiveGalleryButton({
  id,
  isActive,
}: ArchiveGalleryButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    const action = isActive ? "archive" : "restore";

    const confirmed = window.confirm(
      isActive
        ? "Are you sure you want to archive this gallery item?"
        : "Are you sure you want to restore this gallery item?"
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);

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
          data.error || `Failed to ${action} gallery item.`
        );
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : `Failed to ${action} gallery item.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={`text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isActive
          ? "text-red-600 hover:text-red-800"
          : "text-green-700 hover:text-green-900"
      }`}
    >
      {isLoading
        ? "Updating..."
        : isActive
          ? "Archive"
          : "Restore"}
    </button>
  );
}