"use client";

import { useState } from "react";
import { Check, Calendar, StickyNote, SlidersHorizontal } from "lucide-react";
import type { Item } from "@/models/types";
import { priorityStyles } from "@/lib/priority";
import { formatDueDate, type DueTone } from "@/lib/dates";

const dueToneColor: Record<DueTone, string> = {
  overdue: "#f87171",
  today: "#fbbf24",
  soon: "#a78bfa",
  normal: "#8a8a99",
};

/**
 * Linha de item (apresentacional). A lógica otimista e as chamadas ao servidor
 * ficam no ItemsBoard; aqui cuidamos da UI, da edição inline do texto e dos
 * indicadores (prioridade, prazo, nota).
 */
export function ItemRow({
  item,
  onToggle,
  onEdit,
  onOpenDetails,
}: {
  item: Item;
  onToggle: (isDone: boolean) => void;
  onEdit: (content: string) => void;
  onOpenDetails: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.content);

  function saveEdit() {
    setEditing(false);
    const trimmed = value.trim();
    if (!trimmed || trimmed === item.content) {
      setValue(item.content);
      return;
    }
    onEdit(trimmed);
  }

  const due = item.dueDate ? formatDueDate(item.dueDate) : null;
  const hasMeta = Boolean(due || item.note);

  return (
    <div className="card group relative flex items-center gap-3 pl-4 pr-2 py-3 animate-in overflow-hidden">
      {/* Barra de prioridade */}
      {item.priority && (
        <span
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: priorityStyles[item.priority].hex }}
          aria-hidden
        />
      )}

      {/* Checkbox */}
      <button
        onClick={() => onToggle(!item.isDone)}
        aria-pressed={item.isDone}
        aria-label={item.isDone ? "Desmarcar" : "Concluir"}
        className={`size-6 shrink-0 rounded-full border-2 grid place-items-center transition-all active:scale-90 ${
          item.isDone
            ? "bg-success border-success"
            : "border-border hover:border-muted"
        }`}
      >
        {item.isDone && <Check className="size-3.5 text-bg" strokeWidth={3.5} />}
      </button>

      {/* Conteúdo + meta */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setValue(item.content);
                setEditing(false);
              }
            }}
            maxLength={500}
            className="w-full bg-transparent outline-none text-[15px] border-b border-accent/50 pb-0.5"
          />
        ) : (
          <button
            onClick={() => {
              setValue(item.content);
              setEditing(true);
            }}
            className={`block w-full text-left text-[15px] truncate transition-colors ${
              item.isDone ? "text-faint line-through" : "text-foreground"
            }`}
          >
            {item.content}
          </button>
        )}

        {hasMeta && !editing && (
          <div className="flex items-center gap-2.5 mt-1">
            {due && (
              <span
                className="inline-flex items-center gap-1 text-xs"
                style={{ color: dueToneColor[due.tone] }}
              >
                <Calendar className="size-3" />
                {due.label}
              </span>
            )}
            {item.note && (
              <span className="inline-flex items-center text-faint" aria-label="Tem nota">
                <StickyNote className="size-3" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Detalhes */}
      <button
        onClick={onOpenDetails}
        aria-label="Detalhes do item"
        className="size-9 shrink-0 grid place-items-center rounded-lg text-faint hover:text-foreground hover:bg-surface-2 transition-colors"
      >
        <SlidersHorizontal className="size-4" />
      </button>
    </div>
  );
}
