/**
 * Configuração central do Supabase.
 *
 * A chave `anon` é pública por natureza — a segurança dos dados é garantida
 * pelas políticas de Row Level Security (RLS) no banco, não por esconder a chave.
 * NUNCA use a `service_role` key no cliente/browser.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Permite que a UI/design seja visualizada antes de conectar o banco. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
