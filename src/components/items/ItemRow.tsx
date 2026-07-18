"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import type { Item } from "@/models/types";

/**
 * Linha de item (apresentacional). A lógica otimista e as chamadas ao servidor
 * ficam no ItemsBoard; aqui só cuidamos da UI e da edição inline.
 */
export function ItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: Item;
  onToggle: (isDone: boolean) => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
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

  return (
    <div className="card group flex items-center gap-3 px-4 py-3 animate-in">
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
        {item.isDone && (
          <Check className="size-3.5 text-bg" strokeWidth={3.5} />
        )}
      </button>

      {/* Conteúdo */}
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
          className="flex-1 bg-transparent outline-none text-[15px] border-b border-accent/50 pb-0.5"
        />
      ) : (
        <button
          onClick={() => {
            setValue(item.content);
            setEditing(true);
          }}
          className={`flex-1 text-left text-[15px] transition-colors ${
            item.isDone ? "text-faint line-through" : "text-foreground"
          }`}
        >
          {item.content}
        </button>
      )}

      {/* Excluir */}
      <button
        onClick={onDelete}
        aria-label="Excluir item"
        className="size-8 shrink-0 grid place-items-center rounded-lg text-faint hover:text-danger hover:bg-danger/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
