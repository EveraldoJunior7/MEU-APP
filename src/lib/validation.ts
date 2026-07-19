import {
  LIST_COLORS,
  PRIORITIES,
  type ListColor,
  type Priority,
} from "@/models/types";

/**
 * Regras de validação puras (sem dependência de banco, rede ou React).
 *
 * Ficam isoladas aqui de propósito: assim podem ser testadas de forma rápida
 * e determinística, e são reaproveitadas pelos controllers.
 *
 * Convenção: cada função de validação devolve `null` quando está tudo certo,
 * ou uma mensagem de erro (string) para mostrar ao usuário.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIST_NAME_MAX = 80;
export const ITEM_CONTENT_MAX = 500;
export const PASSWORD_MIN = 8;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/** Valida e-mail + senha do login/cadastro. */
export function validateCredentials(
  email: string,
  password: string,
): string | null {
  if (!email || !isValidEmail(email)) {
    return "Informe um e-mail válido.";
  }
  if (password.length < PASSWORD_MIN) {
    return `A senha precisa ter ao menos ${PASSWORD_MIN} caracteres.`;
  }
  return null;
}

/** Valida o nome de uma lista. */
export function validateListName(name: string): string | null {
  if (name.length < 1 || name.length > LIST_NAME_MAX) {
    return `O nome deve ter entre 1 e ${LIST_NAME_MAX} caracteres.`;
  }
  return null;
}

/** Valida o conteúdo de um item. */
export function validateItemContent(content: string): string | null {
  if (content.length < 1 || content.length > ITEM_CONTENT_MAX) {
    return `O item deve ter entre 1 e ${ITEM_CONTENT_MAX} caracteres.`;
  }
  return null;
}

/** Normaliza uma cor recebida, caindo para "violet" se for inválida. */
export function parseColor(value: unknown): ListColor {
  const color = String(value ?? "violet") as ListColor;
  return LIST_COLORS.includes(color) ? color : "violet";
}

/** Normaliza uma prioridade; devolve null se ausente ou inválida. */
export function parsePriority(value: unknown): Priority | null {
  if (value === null || value === undefined || value === "") return null;
  const p = String(value) as Priority;
  return PRIORITIES.includes(p) ? p : null;
}

/**
 * Normaliza uma data de prazo (formato YYYY-MM-DD). Devolve null se vazia
 * ou fora do formato esperado.
 */
export function parseDueDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const s = String(value).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

/** Normaliza uma nota, cortando espaços e limitando a 1000 caracteres. */
export function parseNote(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s) return null;
  return s.slice(0, 1000);
}
