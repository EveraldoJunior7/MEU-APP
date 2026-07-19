import type { Priority } from "@/models/types";

/** Rótulo e cor de cada nível de prioridade. */
export const priorityStyles: Record<
  Priority,
  { label: string; hex: string }
> = {
  low: { label: "Baixa", hex: "#34d399" },
  medium: { label: "Média", hex: "#fbbf24" },
  high: { label: "Alta", hex: "#f87171" },
};
