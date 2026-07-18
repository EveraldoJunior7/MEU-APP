"use client";

import { useState, useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import type { Item } from "@/models/types";
import {
  toggleItemAction,
  editItemAction,
  deleteItemAction,
} from "@/controllers/item.controller";

export function ItemRow({ item }: { item: Item }) {
  const [done, setDone] = useState(item.isDone);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.content);
  const [removing, setRemoving] = useState(false);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !done;
    setDone(next); // otimista
    startTransition(() => toggleItemAction(item.id, item.listId, next));
  }

  function saveEdit() {
    setEditing(false);
    const trimmed = value.trim();
    if (!trimmed || trimmed === item.content) {
      setValue(item.content);
      return;
    }
    startTransition(() => editItemAction(item.id, item.listId, trimmed));
  }

  function remove() {
    setRemoving(true);
    startTransition(() => deleteItemAction(item.id, item.listId));
  }

  return (
    <div
      className={`card group flex items-center gap-3 px-4 py-3 transition-all ${
        removing ? "opacity-40 scale-[0.98]" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={toggle}
        aria-pressed={done}
        aria-label={done ? "Desmarcar" : "Concluir"}
        className={`size-6 shrink-0 rounded-full border-2 grid place-items-center transition-all active:scale-90 ${
          done
            ? "bg-success border-success"
            : "border-border hover:border-muted"
        }`}
      >
        {done && <Check className="size-3.5 text-bg" strokeWidth={3.5} />}
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
          onClick={() => setEditing(true)}
          className={`flex-1 text-left text-[15px] transition-colors ${
            done ? "text-faint line-through" : "text-foreground"
          }`}
        >
          {value}
        </button>
      )}

      {/* Excluir */}
      <button
        onClick={remove}
        aria-label="Excluir item"
        className="size-8 shrink-0 grid place-items-center rounded-lg text-faint hover:text-danger hover:bg-danger/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
