"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ListModel } from "@/models/list.model";
import { LIST_COLORS, type ListColor } from "@/models/types";
import { requireUser } from "./session";
import type { ActionState } from "./types";

function parseColor(value: FormDataEntryValue | null): ListColor {
  const color = String(value ?? "violet") as ListColor;
  return LIST_COLORS.includes(color) ? color : "violet";
}

/** Cria uma nova lista e navega até ela. */
export async function createListAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const color = parseColor(formData.get("color"));

  if (name.length < 1 || name.length > 80) {
    return { error: "O nome deve ter entre 1 e 80 caracteres." };
  }

  const list = await ListModel.create(user.id, name, color);
  revalidatePath("/listas");
  redirect(`/listas/${list.id}`);
}

/** Renomeia e/ou troca a cor de uma lista. */
export async function updateListAction(
  listId: string,
  fields: { name?: string; color?: ListColor },
): Promise<void> {
  const user = await requireUser();

  const payload: { name?: string; color?: ListColor } = {};
  if (typeof fields.name === "string") {
    const name = fields.name.trim();
    if (name.length >= 1 && name.length <= 80) payload.name = name;
  }
  if (fields.color && LIST_COLORS.includes(fields.color)) {
    payload.color = fields.color;
  }
  if (Object.keys(payload).length === 0) return;

  await ListModel.update(listId, user.id, payload);
  revalidatePath("/listas");
  revalidatePath(`/listas/${listId}`);
}

/** Remove uma lista. */
export async function deleteListAction(listId: string): Promise<void> {
  const user = await requireUser();
  await ListModel.remove(listId, user.id);
  revalidatePath("/listas");
  redirect("/listas");
}
