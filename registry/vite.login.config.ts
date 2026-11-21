// The sign-in page of the published Storybook (registry/login), served by registry/server at /login.
import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  root: resolve(import.meta.dirname, "login"),
  base: "/login/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  // The Continua logos and favicons land in login-dist/continua, public before signing in.
  publicDir: resolve(import.meta.dirname, "../packages/tokens/assets"),
  build: {
    outDir: resolve(import.meta.dirname, "login-dist"),
    emptyOutDir: true,
  },
})
