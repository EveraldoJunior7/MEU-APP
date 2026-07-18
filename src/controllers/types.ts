/** Estados retornados pelas Server Actions (usados com useActionState). */

export interface ActionState {
  error?: string;
}

export interface AuthState {
  error?: string;
  message?: string;
}
