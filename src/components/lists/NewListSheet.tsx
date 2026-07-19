"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { createListAction } from "@/controllers/list.controller";
import type { ActionState } from "@/controllers/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Portal } from "@/components/ui/Portal";
import { ColorPicker } from "./ColorPicker";

export function NewListSheet() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(
    createListAction,
    {},
  );

  // Trava o scroll do body enquanto o sheet está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="w-full"
        aria-haspopup="dialog"
      >
        <Plus className="size-5" />
        Nova lista
      </Button>

      {open && (
        <Portal>
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Nova lista"
        >
          {/* Overlay */}
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative w-full sm:max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 pb-8 animate-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Nova lista</h2>
              <button
                onClick={() => setOpen(false)}
                className="size-9 grid place-items-center rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-muted px-1">Nome da lista</label>
                <Input
                  name="name"
                  placeholder="Ex.: Compras do mês, Tarefas…"
                  autoFocus
                  maxLength={80}
                  required
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm text-muted px-1">Cor</label>
                <ColorPicker />
              </div>

              {state.error && (
                <p className="flex items-center gap-2 text-danger text-sm">
                  <AlertCircle className="size-4 shrink-0" />
                  {state.error}
                </p>
              )}

              <SubmitButton size="lg" className="w-full" pendingText="Criando…">
                Criar lista
              </SubmitButton>
            </form>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
