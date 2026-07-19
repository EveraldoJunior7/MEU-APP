import { createClient } from "@/lib/supabase/server";
import { type Item, type ItemRow, mapItemRow } from "./types";

/**
 * Model de Itens — leitura/escrita dos itens de uma lista.
 */
export const ItemModel = {
  /** Itens de uma lista, ordenados por posição. */
  async findAllByList(listId: string, userId: string): Promise<Item[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("list_id", listId)
      .eq("user_id", userId)
      .order("is_done", { ascending: true })
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapItemRow(row as ItemRow));
  },

  /** Cria um item no TOPO da lista (menor posição). */
  async create(
    listId: string,
    userId: string,
    content: string,
  ): Promise<Item> {
    const supabase = await createClient();

    // posição = (menor posição atual) - 1, para o item aparecer no topo
    const { data: firstRow } = await supabase
      .from("items")
      .select("position")
      .eq("list_id", listId)
      .eq("user_id", userId)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    const position = firstRow ? firstRow.position - 1 : 0;

    const { data, error } = await supabase
      .from("items")
      .insert({
        list_id: listId,
        user_id: userId,
        content,
        position,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapItemRow(data as ItemRow);
  },

  /** Marca/desmarca um item como concluído. */
  async setDone(id: string, userId: string, isDone: boolean): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("items")
      .update({ is_done: isDone })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  /** Edita o conteúdo de um item. */
  async updateContent(
    id: string,
    userId: string,
    content: string,
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("items")
      .update({ content })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  /** Atualiza os campos extras do item (prioridade, prazo, nota). */
  async updateFields(
    id: string,
    userId: string,
    fields: {
      priority?: Item["priority"];
      due_date?: string | null;
      note?: string | null;
    },
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("items")
      .update(fields)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  /**
   * Persiste a nova ordem: `position` recebe o índice de cada item na lista
   * de ids fornecida.
   */
  async reorder(
    listId: string,
    userId: string,
    orderedIds: string[],
  ): Promise<void> {
    const supabase = await createClient();

    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase
          .from("items")
          .update({ position: index })
          .eq("id", id)
          .eq("list_id", listId)
          .eq("user_id", userId),
      ),
    );

    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
  },

  /** Remove um item. */
  async remove(id: string, userId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  /** Remove todos os itens concluídos de uma lista. */
  async removeCompleted(listId: string, userId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("items")
      .delete()
      .eq("list_id", listId)
      .eq("user_id", userId)
      .eq("is_done", true);

    if (error) throw new Error(error.message);
  },
};
