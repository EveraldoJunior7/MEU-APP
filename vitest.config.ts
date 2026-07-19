import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Testes de lógica pura rodam em Node (sem DOM, mais rápido).
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Menos overhead: não isola o contexto entre arquivos (seguro porque os
    // testes são puros, sem estado global compartilhado).
    isolate: false,
    // Reporter enxuto em dev; padrão no CI para logs completos.
    reporters: process.env.CI ? "default" : "dot",
  },
  resolve: {
    alias: {
      // Espelha o alias "@/*" do tsconfig para os imports funcionarem nos testes.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
