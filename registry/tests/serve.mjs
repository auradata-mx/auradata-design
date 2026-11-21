/** Serves storybook-static with no dependencies, so the visual tests run the same on macOS, Linux and Docker. */
import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const root = join(import.meta.dirname, "../storybook-static")
const port = Number(process.argv[2] ?? 6008)
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
}

createServer((request, response) => {
  const path = normalize(
    decodeURIComponent(new URL(request.url, "http://localhost").pathname)
  ).replace(/^(\.\.[/\\])+/, "")
  let file = join(root, path)
  if (existsSync(file) && statSync(file).isDirectory())
    file = join(file, "index.html")
  if (!file.startsWith(root) || !existsSync(file)) {
    response.writeHead(404).end()
    return
  }
  response.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
  })
  createReadStream(file).pipe(response)
}).listen(port, "127.0.0.1")
