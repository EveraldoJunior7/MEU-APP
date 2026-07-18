import { createClient } from "@/lib/supabase/server";
import {
  type List,
  type ListColor,
  type ListRow,
  mapListRow,
} from "./types";

/**
 * Model de Listas — toda a leitura/escrita de listas no banco.
 *
 * As políticas de RLS garantem que cada consulta só enxerga as linhas do
 * usuário autenticado. Ainda assim, filtramos/gravamos `user_id`
 * explicitamente como defesa em profundidade.
 */
export const ListModel = {
  /** Retorna todas as listas do usuário, com contagem de itens. */
  async findAllByUser(userId: string): Promise<List[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("lists")
      .select("*, items(is_done)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
      const items = (row.items ?? []) as { is_done: boolean }[];
      const list = mapListRow(row as unknown as ListRow);
      return {
        ...list,
        itemCount: items.length,
        doneCount: items.filter((i) => i.is_done).length,
      };
    });
  },

  /** Retorna uma lista específica do usuário (ou null). */
  async findById(id: string, userId: string): Promise<List | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapListRow(data as ListRow) : null;
  },

  /** Cria uma nova lista. */
  async create(
    userId: string,
    name: string,
    color: ListColor,
  ): Promise<List> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("lists")
      .insert({ user_id: userId, name, color })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapListRow(data as ListRow);
  },

  /** Atualiza nome e/ou cor de uma lista. */
  async update(
    id: string,
    userId: string,
    fields: Partial<Pick<List, "name" | "color">>,
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("lists")
      .update(fields)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  /** Remove uma lista (itens são removidos em cascata pelo banco). */
  async remove(id: string, userId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("lists")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },
};
