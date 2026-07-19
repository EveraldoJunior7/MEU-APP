"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import {
  Plus,
  CheckCircle2,
  ClipboardList,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import type { Item, ListColor } from "@/models/types";
import { listColorStyles } from "@/lib/list-colors";
import {
  addItemAction,
  toggleItemAction,
  editItemAction,
  deleteItemAction,
  updateItemFieldsAction,
  reorderItemsAction,
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
  | { type: "reorder"; ids: string[] }
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
    case "reorder": {
      const byId = new Map(state.map((i) => [i.id, i]));
      return action.ids
        .map((id) => byId.get(id))
        .filter((i): i is Item => Boolean(i));
    }
    case "delete":
      return state.filter((i) => i.id !== action.id);
  }
}

/** Linha arrastável (usa o dnd-kit e fornece a alça de arraste ao ItemRow). */
function SortableItem({
  item,
  onToggle,
  onEdit,
  onDelete,
  onOpenDetails,
}: {
  item: Item;
  onToggle: (isDone: boolean) => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
  onOpenDetails: () => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const handle = (
    <button
      type="button"
      data-drag-handle
      aria-label="Arrastar para reordenar"
      className="size-8 shrink-0 grid place-items-center rounded-lg text-faint hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <ItemRow
      item={item}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
      onOpenDetails={onOpenDetails}
      handle={handle}
      outerRef={setNodeRef}
      outerStyle={{ transform: CSS.Transform.toString(transform), transition }}
      outerAttributes={attributes}
      isDragging={isDragging}
    />
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pending.findIndex((i) => i.id === active.id);
    const newIndex = pending.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const newPending = arrayMove(pending, oldIndex, newIndex);
    const ids = [...newPending.map((i) => i.id), ...done.map((i) => i.id)];

    startTransition(async () => {
      dispatch({ type: "reorder", ids });
      await reorderItemsAction(listId, ids);
    });
  }

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
          {pending.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={pending.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2.5">
                  {pending.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onToggle={(next) => handleToggle(item, next)}
                      onEdit={(content) => handleEdit(item, content)}
                      onDelete={() => handleDelete(item)}
                      onOpenDetails={() => setOpenId(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

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
