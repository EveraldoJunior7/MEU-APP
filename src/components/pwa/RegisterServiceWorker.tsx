"use client";

import { useEffect } from "react";

/**
 * Registra o service worker (apenas em produção, para não atrapalhar o HMR
 * durante o desenvolvimento).
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // silencioso: falha no registro não deve quebrar o app
      });
    }
  }, []);

  return null;
}
