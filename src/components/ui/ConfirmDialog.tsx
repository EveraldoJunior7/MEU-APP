"use client";

import { useEffect } from "react";
import { Portal } from "@/components/ui/Portal";
import { Button } from "@/components/ui/Button";

/** Modal de confirmação reutilizável (renderizado via Portal). */
export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in"
          aria-label={cancelLabel}
          onClick={onCancel}
        />
        <div className="relative w-full sm:max-w-sm glass rounded-t-3xl sm:rounded-3xl p-6 pb-8 animate-in">
          <h2 className="text-lg font-semibold">{title}</h2>
          {message && <p className="text-sm text-muted mt-2">{message}</p>}
          <div className="flex gap-3 mt-6">
            <Button variant="subtle" className="flex-1" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={danger ? "danger" : "primary"}
              className="flex-1"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
