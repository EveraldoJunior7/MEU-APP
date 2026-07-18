"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { LIST_COLORS, type ListColor } from "@/models/types";
import { listColorStyles } from "@/lib/list-colors";

/**
 * Seletor de cor. Mantém um <input hidden name="color"> para envio via form.
 */
export function ColorPicker({
  name = "color",
  defaultValue = "violet",
}: {
  name?: string;
  defaultValue?: ListColor;
}) {
  const [selected, setSelected] = useState<ListColor>(defaultValue);

  return (
    <div>
      <input type="hidden" name={name} value={selected} />
      <div className="flex gap-2.5">
        {LIST_COLORS.map((c) => {
          const { hex, label } = listColorStyles[c];
          const active = selected === c;
          return (
            <button
              key={c}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={active}
              onClick={() => setSelected(c)}
              className="size-8 rounded-full grid place-items-center transition-transform hover:scale-110"
              style={{
                backgroundColor: hex,
                boxShadow: active ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${hex}` : undefined,
              }}
            >
              {active && <Check className="size-4 text-white" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
