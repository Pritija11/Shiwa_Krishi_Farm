"use client";

import type { ReactNode } from "react";

type ConfirmDialogProps = {
  title: string;
  description: ReactNode;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel: string;
  pendingLabel?: string;
  isPending?: boolean;
  confirmVariant?: "primary" | "danger";
};

export default function ConfirmDialog({
  title,
  description,
  errorMessage,
  onClose,
  onConfirm,
  confirmLabel,
  pendingLabel,
  isPending = false,
  confirmVariant = "primary",
}: ConfirmDialogProps) {
  const confirmClasses =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-900 hover:bg-green-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-green-950">
          {title}
        </h2>

        {errorMessage ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : (
          <div className="mt-2 text-sm text-stone-600">
            {description}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {errorMessage ? "Close" : "Cancel"}
          </button>

          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className={`rounded-full px-5 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClasses}`}
            >
              {isPending
                ? (pendingLabel ?? "Working...")
                : confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
