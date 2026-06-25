import { defineConfig } from "vitest/config";

// Testa apenas funções puras de `web/`, sem DOM: ambiente `node` basta.
export default defineConfig({
  test: {
    environment: "node",
    include: ["web/**/*.test.ts"],
  },
});
