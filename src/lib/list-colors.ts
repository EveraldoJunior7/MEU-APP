import type { ListColor } from "@/models/types";

/**
 * Mapeia a cor de uma lista para valores concretos.
 * Usamos hex/inline styles (em vez de classes dinâmicas do Tailwind) para
 * evitar problemas de purge com nomes de classe montados em runtime.
 */
export const listColorStyles: Record<
  ListColor,
  { hex: string; soft: string; label: string }
> = {
  violet: { hex: "#7c6cff", soft: "rgba(124,108,255,0.16)", label: "Violeta" },
  blue: { hex: "#4c8dff", soft: "rgba(76,141,255,0.16)", label: "Azul" },
  emerald: { hex: "#34d399", soft: "rgba(52,211,153,0.16)", label: "Verde" },
  amber: { hex: "#fbbf24", soft: "rgba(251,191,36,0.16)", label: "Âmbar" },
  rose: { hex: "#fb7185", soft: "rgba(251,113,133,0.16)", label: "Rosa" },
  cyan: { hex: "#22d3ee", soft: "rgba(34,211,238,0.16)", label: "Ciano" },
};
