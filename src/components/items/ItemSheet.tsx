"use client";

import { useEffect, useState } from "react";
import { X, Trash2, Flag, Calendar, StickyNote } from "lucide-react";
import type { Item, Priority } from "@/models/types";
import { PRIORITIES } from "@/models/types";
import { priorityStyles } from "@/lib/priority";
import { Button } from "@/components/ui/Button";

/**
 * Editor de um item (bottom sheet): prioridade, prazo, nota e excluir.
 * O estado otimista e as chamadas ao servidor ficam no ItemsBoard.
 */
export function ItemSheet({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: Item;
  onClose: () => void;
  onSave: (fields: {
    priority: Priority | null;
    dueDate: string | null;
    note: string | null;
  }) => void;
  onDelete: () => void;
}) {
  const [priority, setPriority] = useState<Priority | null>(item.priority);
  const [dueDate, setDueDate] = useState(item.dueDate ?? "");
  const [note, setNote] = useState(item.note ?? "");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function save() {
    onSave({
      priority,
      dueDate: dueDate || null,
      note: note.trim() || null,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes do item"
    >
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in"
        aria-label="Fechar"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 pb-8 animate-in">
        <div className="flex items-start justify-between gap-3 mb-5">
          <h2 className="text-base font-semibold leading-snug line-clamp-2">
            {item.content}
          </h2>
          <button
            onClick={onClose}
            className="size-9 shrink-0 grid place-items-center rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Prioridade */}
          <div className="space-y-2.5">
            <span className="flex items-center gap-2 text-sm text-muted px-1">
              <Flag className="size-4" /> Prioridade
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPriority(null)}
                className={`h-11 rounded-xl text-sm font-medium border transition-colors ${
                  priority === null
                    ? "bg-surface-2 border-muted text-foreground"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                Nenhuma
              </button>
              {PRIORITIES.map((p) => {
                const active = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`h-11 rounded-xl text-sm font-medium border transition-colors ${
                      active
                        ? "text-foreground"
                        : "border-border text-muted hover:text-foreground"
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor: `${priorityStyles[p].hex}22`,
                            borderColor: priorityStyles[p].hex,
                          }
                        : undefined
                    }
                  >
                    {priorityStyles[p].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prazo */}
          <div className="space-y-2.5">
            <span className="flex items-center gap-2 text-sm text-muted px-1">
              <Calendar className="size-4" /> Prazo
            </span>
            <div className="flex gap-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl bg-surface border border-border outline-none text-[15px] focus:border-muted transition-colors"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate("")}
                  className="h-11 px-4 rounded-xl border border-border text-sm text-muted hover:text-foreground transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Nota */}
          <div className="space-y-2.5">
            <span className="flex items-center gap-2 text-sm text-muted px-1">
              <StickyNote className="size-4" /> Nota
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Detalhes, link, lembrete…"
              maxLength={1000}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border outline-none text-[15px] resize-none focus:border-muted transition-colors placeholder:text-faint"
            />
          </div>

          <Button onClick={save} size="lg" className="w-full">
            Salvar
          </Button>

          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-danger hover:bg-danger/10 transition-colors text-sm font-medium"
          >
            <Trash2 className="size-4" /> Excluir item
          </button>
        </div>
      </div>
    </div>
  );
}
