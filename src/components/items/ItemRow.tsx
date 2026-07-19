"use client";

import { useRef, useState } from "react";
import { Check, Calendar, StickyNote, Pencil, Trash2 } from "lucide-react";
import type { Item } from "@/models/types";
import { priorityStyles } from "@/lib/priority";
import { formatDueDate, type DueTone } from "@/lib/dates";

const dueToneColor: Record<DueTone, string> = {
  overdue: "#f87171",
  today: "#fbbf24",
  soon: "#a78bfa",
  normal: "#8a8a99",
};

const AXIS_LOCK = 10; // px para decidir se o gesto é horizontal ou vertical
const ACTIONS_WIDTH = 144; // largura revelada (Editar + Excluir)

/**
 * Linha de item compacta.
 *  - Pendentes: deslizar para a esquerda **revela** os botões Editar/Excluir
 *    (ação deliberada, componente mais limpo) + alça de arraste p/ reordenar.
 *  - Concluídos: estáticos, mais discretos, sem swipe (só reabrir/excluir).
 */
export function ItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
  onOpenDetails,
  swipeable = true,
  handle,
  outerRef,
  outerStyle,
  outerAttributes,
  isDragging,
}: {
  item: Item;
  onToggle: (isDone: boolean) => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
  onOpenDetails: () => void;
  swipeable?: boolean;
  handle?: React.ReactNode;
  outerRef?: React.Ref<HTMLDivElement>;
  outerStyle?: React.CSSProperties;
  outerAttributes?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.content);
  const [tx, setTx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const g = useRef({
    startX: 0,
    startY: 0,
    startTx: 0,
    axis: "" as "" | "x" | "y",
    moved: false,
  });

  function saveEdit() {
    setEditing(false);
    const trimmed = value.trim();
    if (!trimmed || trimmed === item.content) {
      setValue(item.content);
      return;
    }
    onEdit(trimmed);
  }

  function close() {
    setTx(0);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (editing || !swipeable) return;
    if ((e.target as HTMLElement).closest("[data-drag-handle]")) return;
    g.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTx: tx,
      axis: "",
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (editing || !swipeable || !e.buttons) return;
    const c = g.current;
    const ddx = e.clientX - c.startX;
    const ddy = e.clientY - c.startY;

    if (c.axis === "") {
      if (Math.abs(ddx) > AXIS_LOCK || Math.abs(ddy) > AXIS_LOCK) {
        c.axis = Math.abs(ddx) > Math.abs(ddy) ? "x" : "y";
        if (c.axis === "x") setDragging(true);
      }
    }

    if (c.axis === "x") {
      c.moved = true;
      setTx(Math.max(-ACTIONS_WIDTH, Math.min(0, c.startTx + ddx)));
    }
  }

  function endGesture() {
    const c = g.current;
    if (c.axis === "x") {
      setTx((prev) => (prev <= -ACTIONS_WIDTH / 2 ? -ACTIONS_WIDTH : 0));
    }
    c.axis = "";
    setDragging(false);
  }

  function onTextClick() {
    if (g.current.moved) {
      g.current.moved = false;
      return; // foi um swipe, não renomeia
    }
    if (tx !== 0) {
      close(); // linha aberta → fecha
      return;
    }
    setValue(item.content);
    setEditing(true);
  }

  const due = item.dueDate ? formatDueDate(item.dueDate) : null;
  const hasMeta = Boolean(due || item.note);

  return (
    <div
      ref={outerRef}
      style={outerStyle}
      {...outerAttributes}
      className={`relative rounded-[var(--radius)] overflow-hidden ${
        isDragging ? "z-10 opacity-80 shadow-xl" : ""
      } ${item.isDone ? "opacity-60" : ""}`}
    >
      {/* Botões revelados pelo swipe (atrás do cartão) */}
      {swipeable && (
        <div className="absolute inset-y-0 right-0 flex">
          <button
            onClick={() => {
              close();
              onOpenDetails();
            }}
            className="w-[72px] flex flex-col items-center justify-center gap-1 bg-surface-2 text-foreground text-xs"
            aria-label="Editar item"
          >
            <Pencil className="size-4" />
            Editar
          </button>
          <button
            onClick={() => {
              close();
              onDelete();
            }}
            className="w-[72px] flex flex-col items-center justify-center gap-1 bg-danger text-white text-xs"
            aria-label="Excluir item"
          >
            <Trash2 className="size-4" />
            Excluir
          </button>
        </div>
      )}

      {/* Cartão */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        style={{
          transform: `translateX(${tx}px)`,
          transition: dragging ? "none" : "transform 0.22s ease",
          touchAction: "pan-y",
        }}
        className="card relative flex items-center gap-2 pl-2 pr-2 py-2.5 overflow-hidden"
      >
        {/* Barra de prioridade */}
        {item.priority && (
          <span
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: priorityStyles[item.priority].hex }}
            aria-hidden
          />
        )}

        {/* Alça de arraste (só pendentes) */}
        {handle}

        {/* Checkbox */}
        <button
          onClick={() => onToggle(!item.isDone)}
          aria-pressed={item.isDone}
          aria-label={item.isDone ? "Reabrir" : "Concluir"}
          className={`size-5 shrink-0 rounded-full border-2 grid place-items-center transition-all active:scale-90 ${
            item.isDone
              ? "bg-success border-success"
              : "border-border hover:border-muted"
          } ${!handle && !item.isDone ? "ml-1" : ""}`}
        >
          {item.isDone && (
            <Check className="size-3 text-bg" strokeWidth={3.5} />
          )}
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
              onClick={onTextClick}
              className={`block w-full text-left text-[15px] truncate transition-colors ${
                item.isDone ? "text-faint line-through" : "text-foreground"
              }`}
            >
              {item.content}
            </button>
          )}

          {hasMeta && !editing && (
            <div className="flex items-center gap-2.5 mt-0.5">
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
                <span
                  className="inline-flex items-center text-faint"
                  aria-label="Tem nota"
                >
                  <StickyNote className="size-3" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Concluídos: excluir direto (sem swipe) */}
        {!swipeable && (
          <button
            onClick={onDelete}
            aria-label="Excluir item"
            className="size-8 shrink-0 grid place-items-center rounded-lg text-faint hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
