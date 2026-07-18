/**
 * Tipos de domínio (camada Model).
 *
 * Estes tipos descrevem as entidades da aplicação independente de onde
 * os dados são persistidos. Se um dia trocarmos o Supabase por outra fonte,
 * apenas os *models* mudam — controllers e views permanecem iguais.
 */

/** Cores disponíveis para personalizar uma lista. */
export const LIST_COLORS = [
  "violet",
  "blue",
  "emerald",
  "amber",
  "rose",
  "cyan",
] as const;

export type ListColor = (typeof LIST_COLORS)[number];

export interface List {
  id: string;
  userId: string;
  name: string;
  color: ListColor;
  createdAt: string;
  /** Contagem de itens (opcional, preenchida em consultas de listagem). */
  itemCount?: number;
  /** Contagem de itens concluídos (opcional). */
  doneCount?: number;
}

export interface Item {
  id: string;
  listId: string;
  userId: string;
  content: string;
  isDone: boolean;
  position: number;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Mapeamento entre o formato do banco (snake_case) e o domínio (camelCase)  */
/* -------------------------------------------------------------------------- */

export interface ListRow {
  id: string;
  user_id: string;
  name: string;
  color: ListColor;
  created_at: string;
}

export interface ItemRow {
  id: string;
  list_id: string;
  user_id: string;
  content: string;
  is_done: boolean;
  position: number;
  created_at: string;
}

export function mapListRow(row: ListRow): List {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
  };
}

export function mapItemRow(row: ItemRow): Item {
  return {
    id: row.id,
    listId: row.list_id,
    userId: row.user_id,
    content: row.content,
    isDone: row.is_done,
    position: row.position,
    createdAt: row.created_at,
  };
}
