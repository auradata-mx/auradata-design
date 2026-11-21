/// <reference types="vitest/config" />
import { resolve } from "node:path"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    projects: [
      {
        // The scripts that build the registry.
        test: { name: "unit", include: ["scripts/**/*.test.mjs"], environment: "node" },
      },
      {
        // Every story is a test: it must render, pass its play function and pass axe (a11y).
        extends: true,
        plugins: [
          storybookTest({
            configDir: resolve(import.meta.dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
})
