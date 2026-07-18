import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Testes de lógica pura rodam em Node (sem DOM, mais rápido).
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // Espelha o alias "@/*" do tsconfig para os imports funcionarem nos testes.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
