import { spawnSync } from 'node:child_process'
import { request as httpRequest } from 'node:http'
import { createHmac, randomBytes } from 'node:crypto'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'

import { createAuthServer, loadConfig } from './index.mjs'

const serverFile = join(import.meta.dirname, 'index.mjs')
// Generated per run: no real password or secret lives in the repository.
const password = randomBytes(12).toString('base64url')
const secret = randomBytes(32).toString('base64url')

let scratch
let base
let server
let nextIp = 1

/** Each test signs in from its own address, so the rate limit of one test never leaks into another. */
const ip = () => `203.0.113.${nextIp++}`

const sign = (expiresAt, key = secret) =>
  `${expiresAt}.${createHmac('sha256', key).update(String(expiresAt)).digest('base64url')}`

const get = (path, headers = {}) => fetch(base + path, { redirect: 'manual', headers })

const login = (fields, headers = {}) =>
  fetch(base + '/login', {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
    body: new URLSearchParams(fields).toString(),
  })

/** Signs in against another server (the rate-limit tests each get a fresh one). */
const loginAt = (at, fields, headers = {}) =>
  fetch(at + '/login', {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
    body: new URLSearchParams(fields).toString(),
  })

/** A server of its own, so failed attempts never leak between rate-limit tests. */
async function freshServer() {
  const own = createAuthServer(
    loadConfig({ SITE_PASSWORD: password, SESSION_SECRET: secret, STATIC_DIR: scratch, LOGIN_DIR: scratch })
  )
  await new Promise((resolve) => own.listen(0, '127.0.0.1', resolve))
  return { at: `http://127.0.0.1:${own.address().port}`, close: () => new Promise((resolve) => own.close(resolve)) }
}

/** Sends the headers at once and the body after a delay, as a burst of slow clients would. */
function slowLogin(at, body, headers, delayMs) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(body)
    const req = httpRequest(at + '/login', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'content-length': payload.length, ...headers },
    })
    req.on('response', (response) => {
      response.resume()
      resolve(response.statusCode)
    })
    req.on('error', reject)
    req.flushHeaders()
    setTimeout(() => req.end(payload), delayMs)
  })
}

const sessionCookie = (response) => (response.headers.get('set-cookie') ?? '').split(';')[0]

beforeAll(async () => {
  scratch = mkdtempSync(join(tmpdir(), 'aura-server-test-'))
  const staticDir = join(scratch, 'static')
  const loginDir = join(scratch, 'login')
  mkdirSync(join(staticDir, 'docs'), { recursive: true })
  mkdirSync(join(loginDir, 'assets'), { recursive: true })
  writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Storybook</title>')
  writeFileSync(join(staticDir, 'index.json'), '{"v":5}')
  writeFileSync(join(staticDir, 'docs', 'index.html'), '<p>docs</p>')
  writeFileSync(join(staticDir, 'app.js'), 'console.log(1)')
  writeFileSync(join(staticDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
  writeFileSync(join(loginDir, 'index.html'), '<!doctype html><title>Entrar</title>')
  writeFileSync(join(loginDir, 'assets', 'login.css'), 'body{}')
  writeFileSync(join(scratch, 'secret.txt'), 'outside the static dir')

  server = createAuthServer(
    loadConfig({ SITE_PASSWORD: password, SESSION_SECRET: secret, STATIC_DIR: staticDir, LOGIN_DIR: loginDir })
  )
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve))
  rmSync(scratch, { recursive: true, force: true })
})

describe('without a session', () => {
  test('a page sends the browser to the sign-in page, keeping where it was going', async () => {
    const response = await get('/?path=/docs/brand', { accept: 'text/html,application/xhtml+xml' })
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/login?next=' + encodeURIComponent('/?path=/docs/brand'))
  })

  test('anything that is not a page gets 401', async () => {
    expect((await get('/index.json', { accept: 'application/json' })).status).toBe(401)
    expect((await get('/app.js')).status).toBe(401)
  })

  test('the sign-in page, its assets and the health check are public', async () => {
    const page = await get('/login?next=%2F', { accept: 'text/html' })
    expect(page.status).toBe(200)
    expect(page.headers.get('content-type')).toMatch(/^text\/html/)
    expect(await page.text()).toContain('Entrar')
    expect(page.headers.get('x-frame-options')).toBe('DENY')

    const css = await get('/login/assets/login.css')
    expect(css.status).toBe(200)
    expect(css.headers.get('content-type')).toMatch(/^text\/css/)

    const health = await get('/healthz')
    expect(health.status).toBe(200)
    expect(await health.text()).toBe('ok')
  })

  test('robots.txt is public and keeps crawlers out', async () => {
    const response = await get('/robots.txt')
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('Disallow: /')
  })

  test('the sign-in page cannot reach outside its directory', async () => {
    const response = await get('/login/..%2f..%2fsecret.txt')
    expect([400, 404]).toContain(response.status)
  })

  test('every response is kept out of search engines and sniffing', async () => {
    for (const response of [await get('/healthz'), await get('/app.js'), await get('/login'), await login({})]) {
      expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
      expect(response.headers.get('x-content-type-options')).toBe('nosniff')
      expect(response.headers.get('referrer-policy')).toBe('same-origin')
    }
  })
})

describe('signing in', () => {
  test('a wrong password goes back to the sign-in page with the error and no cookie', async () => {
    const response = await login({ password: 'wrong', next: '/docs/' }, { 'x-forwarded-for': ip() })
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('/login?error=1&next=' + encodeURIComponent('/docs/'))
    expect(response.headers.get('set-cookie')).toBeNull()
  })

  test('the right password sets a signed, HttpOnly session cookie and goes to next', async () => {
    const response = await login({ password, next: '/?path=/docs/brand' }, { 'x-forwarded-for': ip() })
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('/?path=/docs/brand')
    const cookie = response.headers.get('set-cookie')
    expect(cookie).toMatch(/^aura_session=\d+\.[A-Za-z0-9_-]{43};/)
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('SameSite=Lax')
    expect(cookie).toContain('Path=/')
    expect(cookie).toContain(`Max-Age=${30 * 24 * 60 * 60}`)
    expect(cookie).not.toContain('Secure')
    const expiresAt = Number(cookie.match(/^aura_session=(\d+)/)[1])
    expect(expiresAt - Date.now()).toBeGreaterThan(29 * 24 * 60 * 60 * 1000)
  })

  test('the cookie is Secure when the request came over https', async () => {
    const response = await login({ password, next: '/' }, { 'x-forwarded-for': ip(), 'x-forwarded-proto': 'https' })
    expect(response.headers.get('set-cookie')).toContain('Secure')
  })

  test.each([
    '//evil.com',
    '/\\evil.com',
    'https://evil.com',
    'javascript:alert(1)',
    '',
    '/\t/evil.example',
    '/\t\\evil.example',
    '/\n/x',
    '/caf\u00e9',
  ])(
    'never redirects off the site (next=%j)',
    async (next) => {
      const response = await login({ password, next }, { 'x-forwarded-for': ip() })
      expect(response.status).toBe(303)
      expect(response.headers.get('location')).toBe('/')
    }
  )

  test('signing out clears the cookie and goes to the sign-in page', async () => {
    const response = await fetch(base + '/logout', { method: 'POST', redirect: 'manual' })
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('/login')
    expect(response.headers.get('set-cookie')).toMatch(/^aura_session=;.*Max-Age=0/)

    const sameSite = await fetch(base + '/logout', { method: 'POST', redirect: 'manual', headers: { origin: base } })
    expect(sameSite.status).toBe(303)
  })

  test('signing out from another site is refused', async () => {
    for (const origin of ['https://evil.example', 'null']) {
      const response = await fetch(base + '/logout', { method: 'POST', redirect: 'manual', headers: { origin } })
      expect(response.status).toBe(403)
      expect(response.headers.get('set-cookie')).toBeNull()
    }
  })

  test('a body over 4 KB gets 413', async () => {
    const response = await login({ password: 'x'.repeat(5000) }, { 'x-forwarded-for': ip() })
    expect(response.status).toBe(413)
    expect(response.headers.get('set-cookie')).toBeNull()
  })
})

describe('with a session', () => {
  let cookie
  beforeAll(async () => {
    cookie = sessionCookie(await login({ password, next: '/' }, { 'x-forwarded-for': ip() }))
  })

  test('serves the Storybook with its content types', async () => {
    const page = await get('/', { cookie, accept: 'text/html' })
    expect(page.status).toBe(200)
    expect(page.headers.get('content-type')).toMatch(/^text\/html/)
    expect(await page.text()).toContain('Storybook')

    const index = await get('/index.json', { cookie })
    expect(index.status).toBe(200)
    expect(index.headers.get('content-type')).toMatch(/^application\/json/)

    const script = await get('/app.js', { cookie })
    expect(script.headers.get('content-type')).toMatch(/^text\/javascript/)
  })

  test('the Storybook may only be framed by itself', async () => {
    expect((await get('/', { cookie })).headers.get('x-frame-options')).toBe('SAMEORIGIN')
    expect((await get('/login')).headers.get('x-frame-options')).toBe('DENY')
  })

  test('a directory serves its index.html and a missing file is 404', async () => {
    expect(await (await get('/docs/', { cookie })).text()).toBe('<p>docs</p>')
    expect((await get('/nope.js', { cookie })).status).toBe(404)
  })

  test('refuses paths outside the static directory', async () => {
    for (const path of ['/../secret.txt', '/%2e%2e/secret.txt', '/docs/..%2f..%2fsecret.txt', '/%2e%2e%5csecret.txt', '/%E0%A4%A']) {
      const response = await get(path, { cookie })
      expect([400, 404]).toContain(response.status)
      expect(await response.text()).not.toContain('outside the static dir')
    }
  })

  test('a tampered cookie is rejected', async () => {
    const [expiresAt, signature] = cookie.slice('aura_session='.length).split('.')
    const later = `aura_session=${Number(expiresAt) + 1000}.${signature}`
    const flipped = `aura_session=${expiresAt}.${signature.slice(0, -1)}${signature.endsWith('A') ? 'B' : 'A'}`
    const otherKey = `aura_session=${sign(Number(expiresAt), randomBytes(32).toString('base64url'))}`
    for (const value of [later, flipped, otherKey, 'aura_session=garbage', 'aura_session=']) {
      expect((await get('/index.json', { cookie: value })).status).toBe(401)
    }
  })

  test('an expired cookie is rejected', async () => {
    expect((await get('/index.json', { cookie: `aura_session=${sign(Date.now() - 1000)}` })).status).toBe(401)
  })
})

describe('rate limit', () => {
  let own
  beforeEach(async () => {
    own = await freshServer()
  })
  afterEach(() => own.close())

  const fail = (headers) => loginAt(own.at, { password: 'wrong' }, headers)

  test('ten failed attempts from one address get 429, other addresses are not affected', async () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      expect((await fail({ 'x-forwarded-for': '198.51.100.1' })).status).toBe(303)
    }
    const blocked = await loginAt(own.at, { password }, { 'x-forwarded-for': '198.51.100.1' })
    expect(blocked.status).toBe(429)
    expect(await blocked.text()).toMatch(/intentos/)
    expect(blocked.headers.get('set-cookie')).toBeNull()

    expect((await loginAt(own.at, { password }, { 'x-forwarded-for': '198.51.100.2' })).status).toBe(303)
  })

  test('a successful sign-in clears the count of its address', async () => {
    const headers = { 'x-forwarded-for': '198.51.100.3' }
    for (let attempt = 0; attempt < 9; attempt++) await fail(headers)
    expect((await loginAt(own.at, { password }, headers)).status).toBe(303)
    for (let attempt = 0; attempt < 10; attempt++) expect((await fail(headers)).status).toBe(303)
    expect((await fail(headers)).status).toBe(429)
  })

  test('a forged first x-forwarded-for entry does not change the key: the last one, from the proxy, does', async () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      expect((await fail({ 'x-forwarded-for': `9.9.9.${attempt}, 1.1.1.1` })).status).toBe(303)
    }
    expect((await fail({ 'x-forwarded-for': '9.9.9.99, 1.1.1.1' })).status).toBe(429)
  })

  test('cf-connecting-ip is the key when present', async () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      expect((await fail({ 'cf-connecting-ip': '192.0.2.7', 'x-forwarded-for': `10.0.0.${attempt}` })).status).toBe(303)
    }
    expect((await fail({ 'cf-connecting-ip': '192.0.2.7', 'x-forwarded-for': '10.0.0.200' })).status).toBe(429)
    expect((await fail({ 'cf-connecting-ip': '192.0.2.8', 'x-forwarded-for': '10.0.0.200' })).status).toBe(303)
  })

  test('a concurrent burst with slow bodies gets at most ten attempts', async () => {
    const body = new URLSearchParams({ password: 'wrong' }).toString()
    const statuses = await Promise.all(
      Array.from({ length: 40 }, () => slowLogin(own.at, body, { 'cf-connecting-ip': '192.0.2.9' }, 300))
    )
    expect(statuses.filter((status) => status !== 429).length).toBeLessThanOrEqual(10)
  })

  test('after 100 failures across all addresses every sign-in gets 429', async () => {
    for (let attempt = 0; attempt < 100; attempt++) {
      // Fifty addresses, two failures each: no address reaches its own limit.
      expect((await fail({ 'cf-connecting-ip': `192.0.2.${attempt % 50}` })).status).toBe(303)
    }
    expect((await loginAt(own.at, { password }, { 'cf-connecting-ip': '203.0.113.250' })).status).toBe(429)
  })
})

describe('configuration', () => {
  const start = (env) =>
    spawnSync(process.execPath, [serverFile], {
      env: { PATH: process.env.PATH, PORT: '0', ...env },
      encoding: 'utf8',
      timeout: 5000,
    })

  test('refuses to start without SITE_PASSWORD', () => {
    const result = start({ SESSION_SECRET: secret })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('SITE_PASSWORD')
  })

  test('refuses to start without a SESSION_SECRET of at least 32 characters', () => {
    const missing = start({ SITE_PASSWORD: password })
    expect(missing.status).toBe(1)
    expect(missing.stderr).toContain('SESSION_SECRET')
    const short = start({ SITE_PASSWORD: password, SESSION_SECRET: 'x'.repeat(31) })
    expect(short.status).toBe(1)
    expect(short.stderr).toContain('SESSION_SECRET')
  })

  test('defaults to port 80 and the built directories', () => {
    const config = loadConfig({ SITE_PASSWORD: password, SESSION_SECRET: secret })
    expect(config.port).toBe(80)
    expect(config.staticDir).toMatch(/storybook-static$/)
    expect(config.loginDir).toMatch(/login-dist$/)
  })
})
