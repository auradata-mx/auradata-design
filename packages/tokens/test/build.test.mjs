import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, expect, test } from 'vitest';

const packageRoot = resolve(import.meta.dirname, '..');
let outDir;

const read = (name) => readFileSync(join(outDir, name), 'utf8');

beforeAll(() => {
  outDir = mkdtempSync(join(tmpdir(), 'auradata-tokens-'));
  execFileSync(process.execPath, ['build.mjs', '--out', outDir], { cwd: packageRoot });
});

afterAll(() => {
  rmSync(outDir, { recursive: true, force: true });
});

// The light and dark tokens of THEME_DEFAULT and THEME_DARK in superset/auradata_config.py.
test('antd.json carries the colors of the AuraData BI themes', () => {
  const antd = JSON.parse(read('antd.json'));
  expect(antd.light.token).toMatchObject({
    colorPrimary: '#2563EB',
    colorLink: '#2563EB',
    colorInfo: '#2563EB',
    colorSuccess: '#059669',
    colorWarning: '#D97706',
    colorError: '#DC2626',
    colorBgLayout: '#F5F5F5',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBorder: '#E5E5E5',
    colorBorderSecondary: '#EDEDED',
    colorText: '#0A0A0F',
    colorTextSecondary: '#666666',
    // #737373 in AuraData BI until T15: it read 4.35:1 on #F5F5F5, below WCAG AA.
    colorTextTertiary: '#6E6E6E',
    colorFillSecondary: '#F5F5F5',
    fontFamily: "Outfit, -apple-system, 'Segoe UI', sans-serif",
    fontFamilyCode: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
    borderRadius: 8,
    borderRadiusLG: 14,
    borderRadiusSM: 6,
    motionEaseOut: 'cubic-bezier(0.32, 0.72, 0, 1)',
  });
  expect(antd.light.algorithm).toBe('default');
  expect(antd.dark.token).toMatchObject({
    colorPrimary: '#3B82F6',
    colorLink: '#60A5FA',
    colorSuccess: '#34D399',
    colorWarning: '#F5B544',
    colorError: '#F87171',
    colorBgLayout: '#0A0A0F',
    colorBgContainer: '#111117',
    colorBgElevated: '#191921',
    colorBorder: '#26262F',
    colorText: '#F5F5F7',
    colorTextSecondary: '#A3A3AD',
    colorTextTertiary: '#8B8B96',
  });
  expect(antd.dark.algorithm).toBe('dark');
});

test('tokens.css themes light on :root and dark on .dark', () => {
  const css = read('tokens.css');
  expect(css).toMatch(/:root \{[^}]*--aura-color-primary: #2563EB;/s);
  expect(css).toMatch(/\.dark \{[^}]*--aura-color-primary: #3B82F6;/s);
  expect(css).toContain('--aura-brand-violet: #7C3AED;');
  expect(css).toContain('--aura-chart-1: #2563EB;');
  expect(css).toContain("--aura-font-sans: Outfit, -apple-system, 'Segoe UI', sans-serif;");
});

test('shadcn.css maps the shadcn variables to the AuraData ones', () => {
  const css = read('shadcn.css');
  expect(css).toContain('--primary: var(--aura-color-primary);');
  expect(css).toContain('--background: var(--aura-color-bg-container);');
  expect(css).toContain('--destructive: var(--aura-color-error);');
  expect(css).toContain('--radius: var(--aura-radius-md);');
  expect(css).toContain('--chart-5: var(--aura-chart-5);');
});

test('shadcn-theme.json holds raw light and dark values for a registry theme item', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.light).toMatchObject({ primary: '#2563EB', background: '#FFFFFF', radius: '8px' });
  expect(theme.dark).toMatchObject({ primary: '#3B82F6', background: '#111117' });
  expect(theme.theme['font-sans']).toBe("Outfit, -apple-system, 'Segoe UI', sans-serif");
});

test('tailwind.css gives Tailwind 4 the brand in @theme', () => {
  const css = read('tailwind.css');
  expect(css).toMatch(/@theme \{/);
  expect(css).toContain('--color-aura-blue: #2563EB;');
  expect(css).toContain("--font-sans: Outfit, -apple-system, 'Segoe UI', sans-serif;");
  expect(css).toContain('--ease-fluid: cubic-bezier(0.32, 0.72, 0, 1);');
});

test('infima.css themes Docusaurus in light and dark', () => {
  const css = read('infima.css');
  expect(css).toMatch(/:root \{[^}]*--ifm-color-primary: #2563EB;/s);
  expect(css).toMatch(/\[data-theme='dark'\] \{[^}]*--ifm-color-primary: #3B82F6;/s);
  expect(css).toContain('--ifm-font-family-monospace:');
});

test('tokens.css carries the full scale: space, type, z-index and focus', () => {
  const css = read('tokens.css');
  expect(css).toContain('--aura-space-1: 4px;');
  expect(css).toContain('--aura-space-4: 16px;');
  expect(css).toContain('--aura-font-size-base: 14px;');
  expect(css).toContain('--aura-font-size-4xl: 38px;');
  expect(css).toContain('--aura-font-weight-strong: 600;');
  expect(css).toContain('--aura-line-height-base: 1.5;');
  expect(css).toContain('--aura-z-index-modal: 1050;');
  expect(css).toContain('--aura-focus-width: 2px;');
  expect(css).toContain('--aura-focus-offset: 2px;');
  expect(css).toMatch(/:root \{[^}]*--aura-color-focus-ring: #181818;/s);
  expect(css).toMatch(/\.dark \{[^}]*--aura-color-focus-ring: #F5F5F7;/s);
  expect(css).toMatch(/:root \{[^}]*--aura-color-success-foreground: #0A0A0F;/s);
});

test('shadcn.css adds success, warning and info with foregrounds, and the focus ring', () => {
  const css = read('shadcn.css');
  for (const status of ['success', 'warning', 'info']) {
    expect(css).toContain(`--${status}: var(--aura-color-${status});`);
    expect(css).toContain(`--${status}-foreground: var(--aura-color-${status}-foreground);`);
  }
  expect(css).toContain('--destructive-foreground: var(--aura-color-error-foreground);');
  expect(css).toContain('--ring: var(--aura-color-focus-ring);');
});

test('shadcn-theme.json exposes the status colors to Tailwind', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.light).toMatchObject({ success: '#059669', 'success-foreground': '#0A0A0F', ring: '#181818' });
  expect(theme.dark).toMatchObject({ warning: '#F5B544', 'warning-foreground': '#0A0A0F' });
  expect(theme.theme).toMatchObject({
    'color-success': 'var(--success)',
    'color-success-foreground': 'var(--success-foreground)',
    'color-destructive-foreground': 'var(--destructive-foreground)',
  });
});

test('antd.json carries the type scale and the popup z-index', () => {
  const { light, dark } = JSON.parse(read('antd.json'));
  const scale = {
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontWeightStrong: 600,
    lineHeight: 1.5,
    zIndexPopupBase: 1000,
  };
  expect(light.token).toMatchObject(scale);
  expect(dark.token).toMatchObject(scale);
});

test('tokens.css carries the brand gradient for headline accents', () => {
  expect(read('tokens.css')).toContain(
    '--aura-gradient-brand: linear-gradient(100deg, #2563EB 0%, #7C3AED 55%, #10B981 100%);',
  );
});

test('shadcn gets the whole chart palette and the brand gradient', () => {
  const css = read('shadcn.css');
  expect(css).toContain('--chart-8: var(--aura-chart-8);');
  expect(css).toContain('--gradient-brand: var(--aura-gradient-brand);');
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.light).toMatchObject({ 'chart-6': '#06B6D4', 'chart-8': '#64748B' });
  expect(theme.light['gradient-brand']).toBe('linear-gradient(100deg, #2563EB 0%, #7C3AED 55%, #10B981 100%)');
  expect(theme.theme).toMatchObject({ 'color-chart-6': 'var(--chart-6)', 'color-chart-8': 'var(--chart-8)' });
});
