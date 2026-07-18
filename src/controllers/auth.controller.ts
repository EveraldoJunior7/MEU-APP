"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validateCredentials } from "@/lib/validation";
import type { AuthState } from "./types";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

/** Login com e-mail e senha. */
export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { error: "Conecte o Supabase para entrar (veja o SETUP.md)." };
  }

  const { email, password } = readCredentials(formData);
  const invalid = validateCredentials(email, password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  revalidatePath("/", "layout");
  redirect("/listas");
}

/** Cadastro de novo usuário. */
export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { error: "Conecte o Supabase para criar sua conta (veja o SETUP.md)." };
  }

  const { email, password } = readCredentials(formData);
  const invalid = validateCredentials(email, password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Se a confirmação de e-mail estiver ativa, ainda não há sessão.
  if (data.user && !data.session) {
    return {
      message: "Conta criada! Confirme o e-mail que enviamos para entrar.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/listas");
}

/** Encerra a sessão. */
export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
