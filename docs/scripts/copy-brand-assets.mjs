// Copies the Continua logos from the tokens package into public/brand/continua, where the registry `Logo`
// component looks for them (the same path the registry installs them to in an app).
import { cpSync, rmSync } from "node:fs"
import { fileURLToPath } from "node:url"

const from = fileURLToPath(new URL("../../packages/tokens/assets/continua", import.meta.url))
const to = fileURLToPath(new URL("../public/brand/continua", import.meta.url))

rmSync(to, { recursive: true, force: true })
cpSync(from, to, { recursive: true })
