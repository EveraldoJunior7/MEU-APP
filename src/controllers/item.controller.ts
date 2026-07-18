"use server";

import { revalidatePath } from "next/cache";
import { ItemModel } from "@/models/item.model";
import { requireUser } from "./session";
import type { ActionState } from "./types";

/** Adiciona um item a uma lista. */
export async function addItemAction(
  listId: string,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const content = String(formData.get("content") ?? "").trim();
  if (content.length < 1 || content.length > 500) {
    return { error: "O item deve ter entre 1 e 500 caracteres." };
  }

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
  if (trimmed.length < 1 || trimmed.length > 500) return;
  await ItemModel.updateContent(itemId, user.id, trimmed);
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
