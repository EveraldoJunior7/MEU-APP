import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { List } from "@/models/types";
import { listColorStyles } from "@/lib/list-colors";

export function ListCard({ list }: { list: List }) {
  const color = listColorStyles[list.color];
  const total = list.itemCount ?? 0;
  const done = list.doneCount ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  return (
    <Link
      href={`/listas/${list.id}`}
      className="card group relative flex items-center gap-4 p-4 overflow-hidden transition-all hover:border-white/15 active:scale-[0.99]"
    >
      {/* Faixa de cor à esquerda */}
      <span
        className="absolute left-0 inset-y-0 w-1"
        style={{ backgroundColor: color.hex }}
      />

      <div
        className="size-11 rounded-xl grid place-items-center shrink-0"
        style={{ backgroundColor: color.soft }}
      >
        <span
          className="size-3 rounded-full"
          style={{ backgroundColor: color.hex }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{list.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-surface-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: color.hex }}
            />
          </div>
          <span className="text-xs text-muted tabular-nums shrink-0">
            {total === 0 ? "vazia" : allDone ? "concluída ✓" : `${done}/${total}`}
          </span>
        </div>
      </div>

      <ChevronRight className="size-5 text-faint group-hover:text-muted transition-colors shrink-0" />
    </Link>
  );
}
