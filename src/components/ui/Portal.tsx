"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Renderiza o conteúdo diretamente no <body>, fora da árvore atual.
 *
 * Essencial para modais/sheets com `position: fixed`: assim eles escapam de
 * qualquer ancestral com `transform` (ex.: a animação de entrada da página),
 * que de outra forma vira o "containing block" e desloca o modal.
 *
 * Usa `useSyncExternalStore` para detectar o cliente sem `setState` em efeito
 * e sem descompasso de hidratação.
 */
const subscribe = () => () => {};

export function Portal({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;
  return createPortal(children, document.body);
}
