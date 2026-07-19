/**
 * Formata uma data de prazo (YYYY-MM-DD) em rótulo amigável + "tom" para cor.
 * Comparações feitas em data local (sem hora) para evitar erros de fuso.
 */
export type DueTone = "overdue" | "today" | "soon" | "normal";

export function formatDueDate(
  dateStr: string,
): { label: string; tone: DueTone } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((due.getTime() - today.getTime()) / dayMs);

  if (diffDays < 0) return { label: "Atrasado", tone: "overdue" };
  if (diffDays === 0) return { label: "Hoje", tone: "today" };
  if (diffDays === 1) return { label: "Amanhã", tone: "soon" };

  const label = due.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
  return { label, tone: diffDays <= 3 ? "soon" : "normal" };
}
