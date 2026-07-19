"use server";

import { revalidatePath } from "next/cache";
import { ItemModel } from "@/models/item.model";
import {
  validateItemContent,
  parsePriority,
  parseDueDate,
  parseNote,
} from "@/lib/validation";
import type { Priority } from "@/models/types";
import { requireUser } from "./session";
import type { ActionState } from "./types";

/** Adiciona um item a uma lista. */
export async function addItemAction(
  listId: string,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const content = String(formData.get("content") ?? "").trim();
  const invalid = validateItemContent(content);
  if (invalid) return { error: invalid };

  await ItemModel.create(listId, user.id, content);
  revalidatePath(`/listas/${listId}`);
  return {};
}

/** Marca/desmarca um item. */
export async function toggleItemAction(
  itemId: string,
  listId: string,
  isDone: boolean,
): Promise<void> {
  const user = await requireUser();
  await ItemModel.setDone(itemId, user.id, isDone);
  revalidatePath(`/listas/${listId}`);
}

/** Edita o conteúdo de um item. */
export async function editItemAction(
  itemId: string,
  listId: string,
  content: string,
): Promise<void> {
  const user = await requireUser();
  const trimmed = content.trim();
  if (validateItemContent(trimmed)) return;
  await ItemModel.updateContent(itemId, user.id, trimmed);
  revalidatePath(`/listas/${listId}`);
}

/** Atualiza prioridade, prazo e/ou nota de um item. */
export async function updateItemFieldsAction(
  itemId: string,
  listId: string,
  fields: {
    priority?: Priority | null;
    dueDate?: string | null;
    note?: string | null;
  },
): Promise<void> {
  const user = await requireUser();

  const payload: {
    priority?: Priority | null;
    due_date?: string | null;
    note?: string | null;
  } = {};

  if ("priority" in fields) payload.priority = parsePriority(fields.priority);
  if ("dueDate" in fields) payload.due_date = parseDueDate(fields.dueDate);
  if ("note" in fields) payload.note = parseNote(fields.note);

  if (Object.keys(payload).length === 0) return;

  await ItemModel.updateFields(itemId, user.id, payload);
  revalidatePath(`/listas/${listId}`);
}

/** Persiste a nova ordem dos itens de uma lista. */
export async function reorderItemsAction(
  listId: string,
  orderedIds: string[],
): Promise<void> {
  const user = await requireUser();
  if (!orderedIds.length) return;
  await ItemModel.reorder(listId, user.id, orderedIds);
  revalidatePath(`/listas/${listId}`);
}

/** Remove um item. */
export async function deleteItemAction(
  itemId: string,
  listId: string,
): Promise<void> {
  const user = await requireUser();
  await ItemModel.remove(itemId, user.id);
  revalidatePath(`/listas/${listId}`);
}
