/**
 * The published Storybook behind the AuraData sign-in page, with no npm dependencies.
 * One team password (SITE_PASSWORD) opens a signed, HttpOnly session cookie; without it only
 * the sign-in page, its assets, robots.txt and the health check answer.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const COOKIE = 'aura_session'
const SESSION_MS = 30 * 24 * 60 * 60 * 1000
const MAX_FAILURES = 10
/** A backstop across every address, in case the per-address key is ever spread out. */
const MAX_GLOBAL_FAILURES = 100
const FAILURE_WINDOW_MS = 15 * 60 * 1000
const MAX_BODY_BYTES = 4096

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

const COMMON_HEADERS = {
  'x-robots-tag': 'noindex, nofollow',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'same-origin',
}

/** Reads the configuration from the environment; throws when a required value is missing. */
export function loadConfig(env = process.env) {
  if (!env.SITE_PASSWORD) throw new Error('SITE_PASSWORD is required: the team password of the Storybook.')
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET is required and must have at least 32 characters: it signs the session cookie.')
  }
  const here = import.meta.dirname
  return {
    password: env.SITE_PASSWORD,
    secret: env.SESSION_SECRET,
    port: env.PORT === undefined || env.PORT === '' ? 80 : Number(env.PORT),
    staticDir: resolve(env.STATIC_DIR ?? join(here, '../storybook-static')),
    loginDir: resolve(env.LOGIN_DIR ?? join(here, '../login-dist')),
  }
}

const digest = (value) => createHash('sha256').update(value).digest()

const signature = (secret, expiresAt) => createHmac('sha256', secret).update(String(expiresAt)).digest('base64url')

function readCookie(request, name) {
  for (const part of (request.headers.cookie ?? '').split(';')) {
    const index = part.indexOf('=')
    if (index !== -1 && part.slice(0, index).trim() === name) return part.slice(index + 1).trim()
  }
  return undefined
}

function hasSession(request, secret) {
  const value = readCookie(request, COOKIE)
  const match = value && /^(\d{1,16})\.([A-Za-z0-9_-]{43})$/.exec(value)
  if (!match) return false
  const expected = Buffer.from(signature(secret, match[1]))
  const given = Buffer.from(match[2])
  return expected.length === given.length && timingSafeEqual(expected, given) && Number(match[1]) > Date.now()
}

const isHttps = (request) => String(request.headers['x-forwarded-proto'] ?? '').split(',')[0].trim() === 'https'

function sessionCookie(request, secret) {
  const expiresAt = Date.now() + SESSION_MS
  const secure = isHttps(request) ? '; Secure' : ''
  return `${COOKIE}=${expiresAt}.${signature(secret, expiresAt)}; Max-Age=${SESSION_MS / 1000}; Path=/; HttpOnly; SameSite=Lax${secure}`
}

const clearedCookie = (request) =>
  `${COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${isHttps(request) ? '; Secure' : ''}`

/**
 * Only a path on this site in printable ASCII: "/x", never "//host", "/\host", "https://host",
 * nor tabs or newlines, which browsers strip from Location ("/\t/host" would become "//host").
 */
const safeNext = (next) => (typeof next === 'string' && /^\/(?![/\\])[\x21-\x7e]*$/.test(next) ? next : '/')

/**
 * The client address for the rate limit. In production the path is client → Cloudflare → Traefik →
 * this server: Cloudflare sets cf-connecting-ip, and the last x-forwarded-for entry is the one the
 * nearest proxy added. The first entries come from the client and can be forged.
 */
function clientKey(request) {
  const cloudflare = String(request.headers['cf-connecting-ip'] ?? '').trim()
  if (cloudflare) return cloudflare
  const forwarded = String(request.headers['x-forwarded-for'] ?? '').split(',').map((entry) => entry.trim()).filter(Boolean)
  return forwarded.at(-1) || request.socket.remoteAddress || 'unknown'
}

/** A same-site request: no Origin (a plain navigation or an old browser) or one whose host is ours. */
function sameOrigin(request) {
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === request.headers.host
  } catch {
    return false
  }
}

function send(response, status, headers = {}, body = '') {
  response.writeHead(status, { ...COMMON_HEADERS, ...headers })
  response.end(body)
}

/** The form, or null when the body is over MAX_BODY_BYTES (read to the end and dropped, so 413 can be sent). */
function readForm(request) {
  return new Promise((done, fail) => {
    let size = 0
    const chunks = []
    request.on('data', (chunk) => {
      size += chunk.length
      if (size <= MAX_BODY_BYTES) chunks.push(chunk)
    })
    request.on('end', () =>
      done(size > MAX_BODY_BYTES ? null : new URLSearchParams(Buffer.concat(chunks).toString('utf8')))
    )
    request.on('error', fail)
  })
}

const tooLarge = (response) =>
  send(response, 413, { 'content-type': 'text/plain; charset=utf-8', connection: 'close' }, 'Solicitud demasiado grande')

/** Maps a URL path inside root, or null when it is malformed or leaves root. */
function resolveInside(root, urlPath) {
  let decoded
  try {
    decoded = decodeURIComponent(urlPath)
  } catch {
    return null
  }
  if (decoded.includes('\0') || decoded.includes('\\')) return null
  const file = resolve(root, '.' + (decoded.startsWith('/') ? decoded : '/' + decoded))
  return file === root || file.startsWith(root + sep) ? file : null
}

async function serveFile(request, response, root, urlPath, extraHeaders = {}) {
  let file = resolveInside(root, urlPath)
  if (!file) return send(response, 404, { ...extraHeaders, 'content-type': 'text/plain; charset=utf-8' }, 'No encontrado')
  try {
    let info = await stat(file)
    if (info.isDirectory()) {
      file = join(file, 'index.html')
      info = await stat(file)
    }
    if (!info.isFile()) throw new Error('not a file')
  } catch {
    return send(response, 404, { ...extraHeaders, 'content-type': 'text/plain; charset=utf-8' }, 'No encontrado')
  }
  const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream'
  const headers = { ...COMMON_HEADERS, ...extraHeaders, 'content-type': type }
  if (type.startsWith('text/html')) headers['cache-control'] = 'no-cache'
  if (request.method === 'HEAD') {
    response.writeHead(200, headers)
    return response.end()
  }
  const stream = createReadStream(file)
  stream.once('open', () => {
    response.writeHead(200, headers)
    stream.pipe(response)
  })
  stream.once('error', () => {
    if (!response.headersSent) send(response, 500, {}, '')
    else response.destroy()
  })
}

/** Builds the HTTP server; listen() is the caller's. */
export function createAuthServer(config) {
  const passwordDigest = digest(config.password)
  /** Failed sign-ins per client address, and across all of them: { count, resetAt }. */
  const failures = new Map()
  let global = { count: 0, resetAt: 0 }

  const current = (entry, now) => (entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + FAILURE_WINDOW_MS })

  const blocked = (key, now) => {
    global = current(global, now)
    return global.count >= MAX_GLOBAL_FAILURES || current(failures.get(key), now).count >= MAX_FAILURES
  }

  const recordFailure = (key, now) => {
    const entry = current(failures.get(key), now)
    entry.count++
    failures.set(key, entry)
    global.count++
    if (failures.size > 10000) {
      for (const [stale, value] of failures) if (value.resetAt <= now) failures.delete(stale)
    }
  }

  const tooMany = (response) =>
    send(
      response,
      429,
      { 'content-type': 'text/plain; charset=utf-8', 'retry-after': String(FAILURE_WINDOW_MS / 1000) },
      'Demasiados intentos. Espera 15 minutos y vuelve a intentarlo.'
    )

  async function signIn(request, response) {
    if (Number(request.headers['content-length'] ?? 0) > MAX_BODY_BYTES) {
      request.resume()
      return tooLarge(response)
    }
    const form = await readForm(request)
    if (!form) return tooLarge(response)
    // From here to the response there is no await: the check and the record of a failure happen in
    // one step, so a burst of concurrent requests cannot all pass the check before any is counted.
    const key = clientKey(request)
    const now = Date.now()
    if (blocked(key, now)) return tooMany(response)
    const next = safeNext(form.get('next'))
    const given = digest(form.get('password') ?? '')
    if (form.get('password') && timingSafeEqual(given, passwordDigest)) {
      failures.delete(key)
      return send(response, 303, { location: next, 'set-cookie': sessionCookie(request, config.secret) })
    }
    recordFailure(key, now)
    const query = new URLSearchParams({ error: '1' })
    if (next !== '/') query.set('next', next)
    return send(response, 303, { location: `/login?${query}` })
  }

  async function handle(request, response) {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const path = url.pathname
    const method = request.method ?? 'GET'
    const reading = method === 'GET' || method === 'HEAD'

    if (path === '/healthz' && reading) return send(response, 200, { 'content-type': 'text/plain' }, 'ok')
    if (path === '/robots.txt' && reading) {
      return send(response, 200, { 'content-type': TYPES['.txt'] }, 'User-agent: *\nDisallow: /\n')
    }
    if (path === '/login' && method === 'POST') return signIn(request, response)
    if (path === '/logout' && method === 'POST') {
      if (!sameOrigin(request)) return send(response, 403, { 'content-type': 'text/plain; charset=utf-8' }, 'No permitido')
      return send(response, 303, { location: '/login', 'set-cookie': clearedCookie(request) })
    }
    if ((path === '/login' || path === '/login/' || path.startsWith('/login/')) && reading) {
      const inner = path.slice('/login'.length) || '/'
      return serveFile(request, response, config.loginDir, inner, { 'x-frame-options': 'DENY' })
    }

    if (!hasSession(request, config.secret)) {
      if (method === 'GET' && String(request.headers.accept ?? '').includes('text/html')) {
        const next = encodeURIComponent(path + url.search)
        return send(response, 302, { location: `/login?next=${next}` })
      }
      return send(response, 401, { 'content-type': 'text/plain; charset=utf-8' }, 'Inicia sesión para continuar.')
    }
    if (!reading) return send(response, 405, { allow: 'GET, HEAD' })
    return serveFile(request, response, config.staticDir, path, { 'x-frame-options': 'SAMEORIGIN' })
  }

  return createServer((request, response) => {
    handle(request, response).catch(() => {
      if (!response.headersSent) send(response, 500, {}, '')
      else response.destroy()
    })
  })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let config
  try {
    config = loadConfig()
  } catch (error) {
    console.error(`auradata storybook server: ${error.message}`)
    process.exit(1)
  }
  createAuthServer(config).listen(config.port, () => {
    console.log(`auradata storybook server on port ${config.port}`)
  })
}
