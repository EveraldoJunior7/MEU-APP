"use client";

import { useRef, useState } from "react";
import {
  Check,
  Calendar,
  StickyNote,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import type { Item } from "@/models/types";
import { priorityStyles } from "@/lib/priority";
import { formatDueDate, type DueTone } from "@/lib/dates";

const dueToneColor: Record<DueTone, string> = {
  overdue: "#f87171",
  today: "#fbbf24",
  soon: "#a78bfa",
  normal: "#8a8a99",
};

const SWIPE_THRESHOLD = 80; // px para disparar a ação
const AXIS_LOCK = 10; // px para decidir se o gesto é horizontal ou vertical
const MAX_SWIPE = 130;

/**
 * Linha de item (apresentacional) com **swipe** (deslizar p/ concluir ou
 * excluir) e suporte a **reordenar** (alça de arraste via dnd-kit).
 *
 * O swipe usa trava de eixo + `touch-action: pan-y` (preserva o scroll) e é
 * ignorado quando o gesto começa na alça de arraste (`[data-drag-handle]`),
 * evitando conflito entre os dois gestos.
 */
export function ItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
  onOpenDetails,
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
  handle?: React.ReactNode;
  outerRef?: React.Ref<HTMLDivElement>;
  outerStyle?: React.CSSProperties;
  outerAttributes?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.content);
  const [dx, setDx] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const g = useRef({
    startX: 0,
    startY: 0,
    axis: "" as "" | "x" | "y",
    dx: 0,
    active: false,
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

  function onPointerDown(e: React.PointerEvent) {
    if (editing) return;
    // gesto iniciado na alça de arraste? deixa o dnd-kit cuidar.
    if ((e.target as HTMLElement).closest("[data-drag-handle]")) return;
    g.current = {
      startX: e.clientX,
      startY: e.clientY,
      axis: "",
      dx: 0,
      active: true,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const cur = g.current;
    if (!cur.active || !e.buttons) return;
    const ddx = e.clientX - cur.startX;
    const ddy = e.clientY - cur.startY;

    if (cur.axis === "") {
      if (Math.abs(ddx) > AXIS_LOCK || Math.abs(ddy) > AXIS_LOCK) {
        cur.axis = Math.abs(ddx) > Math.abs(ddy) ? "x" : "y";
        if (cur.axis === "x") setSwiping(true);
      }
    }

    if (cur.axis === "x") {
      const clamped = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, ddx));
      cur.dx = clamped;
      setDx(clamped);
    }
  }

  function endGesture() {
    const cur = g.current;
    if (!cur.active) return;
    if (cur.axis === "x") {
      if (cur.dx >= SWIPE_THRESHOLD) onToggle(!item.isDone);
      else if (cur.dx <= -SWIPE_THRESHOLD) onDelete();
    }
    cur.axis = "";
    cur.dx = 0;
    cur.active = false;
    setDx(0);
    setSwiping(false);
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
      }`}
    >
      {/* Fundo revelado pelo swipe */}
      <div className="absolute inset-0 flex items-center justify-between px-5">
        <span
          className="text-success transition-opacity"
          style={{ opacity: dx > 8 ? Math.min(1, dx / SWIPE_THRESHOLD) : 0 }}
          aria-hidden
        >
          <Check className="size-5" strokeWidth={3} />
        </span>
        <span
          className="text-danger transition-opacity"
          style={{ opacity: dx < -8 ? Math.min(1, -dx / SWIPE_THRESHOLD) : 0 }}
          aria-hidden
        >
          <Trash2 className="size-5" />
        </span>
      </div>

      {/* Cartão (arrastável no eixo horizontal p/ swipe) */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        style={{
          transform: `translateX(${dx}px)`,
          transition: swiping ? "none" : "transform 0.2s ease",
          touchAction: "pan-y",
        }}
        className="card relative flex items-center gap-2 pl-2 pr-2 py-3 animate-in overflow-hidden"
      >
        {/* Barra de prioridade */}
        {item.priority && (
          <span
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: priorityStyles[item.priority].hex }}
            aria-hidden
          />
        )}

        {/* Alça de arraste (reordenar) */}
        {handle}

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

        {/* Detalhes */}
        <button
          onClick={onOpenDetails}
          aria-label="Detalhes do item"
          className="size-9 shrink-0 grid place-items-center rounded-lg text-faint hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <SlidersHorizontal className="size-4" />
        </button>
      </div>
    </div>
  );
}
