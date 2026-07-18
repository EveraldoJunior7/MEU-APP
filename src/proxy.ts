import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy (antigo "middleware"): roda antes de cada request para renovar a
 * sessão do Supabase e proteger rotas privadas.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Aplica em todas as rotas, exceto estáticos, imagens e arquivos do PWA
    // (manifesto e service worker precisam ser acessíveis sem sessão).
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
