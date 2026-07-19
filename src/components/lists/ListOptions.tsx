"use client";

import { useEffect, useState, useTransition } from "react";
import { MoreHorizontal, X, Trash2, Loader2 } from "lucide-react";
import type { ListColor } from "@/models/types";
import {
  updateListAction,
  deleteListAction,
} from "@/controllers/list.controller";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Portal } from "@/components/ui/Portal";
import { ColorPicker } from "./ColorPicker";

export function ListOptions({
  id,
  name,
  color,
}: {
  id: string;
  name: string;
  color: ListColor;
}) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSave(formData: FormData) {
    const newName = String(formData.get("name") ?? "");
    const newColor = String(formData.get("color") ?? color) as ListColor;
    startTransition(async () => {
      await updateListAction(id, { name: newName, color: newColor });
      setOpen(false);
    });
  }

  function handleDelete() {
    startTransition(() => deleteListAction(id));
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Opções da lista"
        className="size-9 grid place-items-center rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
      >
        <MoreHorizontal className="size-5" />
      </button>

      {open && (
        <Portal>
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Editar lista"
        >
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full sm:max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 pb-8 animate-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Editar lista</h2>
              <button
                onClick={() => setOpen(false)}
                className="size-9 grid place-items-center rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <form action={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-muted px-1">Nome</label>
                <Input name="name" defaultValue={name} maxLength={80} required />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm text-muted px-1">Cor</label>
                <ColorPicker defaultValue={color} />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={pending}
              >
                {pending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-border">
              {confirmDelete ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted text-center">
                    Excluir esta lista e todos os seus itens?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="subtle"
                      size="md"
                      className="flex-1"
                      onClick={() => setConfirmDelete(false)}
                      disabled={pending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      className="flex-1"
                      onClick={handleDelete}
                      disabled={pending}
                    >
                      {pending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Excluir"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-full text-danger hover:bg-danger/10 transition-colors text-sm font-medium"
                >
                  <Trash2 className="size-4" />
                  Excluir lista
                </button>
              )}
            </div>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
