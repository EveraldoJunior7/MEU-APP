"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { Plus, CheckCircle2, ClipboardList, AlertCircle } from "lucide-react";
import type { Item, ListColor } from "@/models/types";
import { listColorStyles } from "@/lib/list-colors";
import {
  addItemAction,
  toggleItemAction,
  editItemAction,
  deleteItemAction,
  updateItemFieldsAction,
} from "@/controllers/item.controller";
import { ItemRow } from "./ItemRow";
import { ItemSheet } from "./ItemSheet";

/**
 * Camada cliente que gerencia os itens de uma lista com **atualização
 * otimista** (useOptimistic): marcar, adicionar, editar e excluir refletem na
 * tela na hora, enquanto a Server Action sincroniza com o banco em segundo
 * plano. Quando o servidor revalida, o estado real substitui o otimista.
 */

type ItemFields = Pick<Item, "priority" | "dueDate" | "note">;

type OptimisticAction =
  | { type: "add"; item: Item }
  | { type: "toggle"; id: string; isDone: boolean }
  | { type: "edit"; id: string; content: string }
  | { type: "update"; id: string; fields: ItemFields }
  | { type: "delete"; id: string };

function reducer(state: Item[], action: OptimisticAction): Item[] {
  switch (action.type) {
    case "add":
      return [...state, action.item];
    case "toggle":
      return state.map((i) =>
        i.id === action.id ? { ...i, isDone: action.isDone } : i,
      );
    case "edit":
      return state.map((i) =>
        i.id === action.id ? { ...i, content: action.content } : i,
      );
    case "update":
      return state.map((i) =>
        i.id === action.id ? { ...i, ...action.fields } : i,
      );
    case "delete":
      return state.filter((i) => i.id !== action.id);
  }
}

export function ItemsBoard({
  listId,
  color,
  initialItems,
}: {
  listId: string;
  color: ListColor;
  initialItems: Item[];
}) {
  const [items, dispatch] = useOptimistic(initialItems, reducer);
  const [, startTransition] = useTransition();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accent = listColorStyles[color].hex;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setDraft("");
    setError(null);
    inputRef.current?.focus();

    const temp: Item = {
      id: `temp-${Date.now()}`,
      listId,
      userId: "",
      content,
      isDone: false,
      position: Number.MAX_SAFE_INTEGER,
      createdAt: new Date().toISOString(),
      priority: null,
      dueDate: null,
      note: null,
    };
    const formData = new FormData();
    formData.set("content", content);

    startTransition(async () => {
      dispatch({ type: "add", item: temp });
      const res = await addItemAction(listId, formData);
      if (res?.error) setError(res.error);
    });
  }

  function handleToggle(item: Item, isDone: boolean) {
    // feedback tátil leve ao concluir (onde houver suporte)
    if (isDone && typeof navigator !== "undefined") {
      navigator.vibrate?.(15);
    }
    startTransition(async () => {
      dispatch({ type: "toggle", id: item.id, isDone });
      await toggleItemAction(item.id, listId, isDone);
    });
  }

  function handleEdit(item: Item, content: string) {
    startTransition(async () => {
      dispatch({ type: "edit", id: item.id, content });
      await editItemAction(item.id, listId, content);
    });
  }

  function handleDelete(item: Item) {
    startTransition(async () => {
      dispatch({ type: "delete", id: item.id });
      await deleteItemAction(item.id, listId);
    });
  }

  function handleUpdateFields(item: Item, fields: ItemFields) {
    startTransition(async () => {
      dispatch({ type: "update", id: item.id, fields });
      await updateItemFieldsAction(item.id, listId, fields);
    });
  }

  const openItem = openId ? items.find((i) => i.id === openId) : undefined;

  const pending = items.filter((i) => !i.isDone);
  const done = items.filter((i) => i.isDone);

  return (
    <div className="space-y-5">
      {/* Resumo (otimista) */}
      {items.length > 0 && (
        <p className="text-sm text-muted">
          {done.length} de {items.length} concluído
          {items.length === 1 ? "" : "s"}
        </p>
      )}

      {/* Adicionar item */}
      <form onSubmit={handleAdd}>
        <div className="glass rounded-2xl flex items-center gap-2 p-2 pl-4">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Adicionar item…"
            maxLength={500}
            autoComplete="off"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-faint h-10"
          />
          <button
            type="submit"
            aria-label="Adicionar"
            className="size-10 shrink-0 grid place-items-center rounded-xl text-accent-foreground transition-colors active:scale-95"
            style={{ backgroundColor: accent }}
          >
            <Plus className="size-5" />
          </button>
        </div>
        {error && (
          <p className="flex items-center gap-2 text-danger text-sm mt-2 px-1">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}
      </form>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="card flex flex-col items-center text-center gap-3 py-12 px-6">
          <div className="size-14 rounded-2xl bg-surface-2 grid place-items-center">
            <ClipboardList className="size-7 text-muted" />
          </div>
          <p className="text-sm text-muted">
            Lista vazia. Adicione o primeiro item acima.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {pending.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={(next) => handleToggle(item, next)}
              onEdit={(content) => handleEdit(item, content)}
              onDelete={() => handleDelete(item)}
              onOpenDetails={() => setOpenId(item.id)}
            />
          ))}

          {done.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center gap-2 px-1 mb-2.5 text-muted">
                <CheckCircle2 className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Concluídos ({done.length})
                </span>
              </div>
              <div className="space-y-2.5">
                {done.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onToggle={(next) => handleToggle(item, next)}
                    onEdit={(content) => handleEdit(item, content)}
                    onDelete={() => handleDelete(item)}
                    onOpenDetails={() => setOpenId(item.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {openItem && (
        <ItemSheet
          item={openItem}
          onClose={() => setOpenId(null)}
          onSave={(fields) => handleUpdateFields(openItem, fields)}
          onDelete={() => handleDelete(openItem)}
        />
      )}
    </div>
  );
}
