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
    colorBgLayout: '#141414',
    colorBgContainer: '#1A1A1A',
    colorBgElevated: '#222222',
    colorBorder: '#2E2E2E',
    colorText: '#F0F0F0',
    colorTextSecondary: '#A3A3A3',
    colorTextTertiary: '#8C8C8C',
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
  expect(theme.dark).toMatchObject({ primary: '#3B82F6', background: '#1A1A1A' });
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
  // Azul Aura: 5.2:1 on white, 7.4:1 on the night container.
  expect(css).toMatch(/:root \{[^}]*--aura-color-focus-ring: #2563EB;/s);
  expect(css).toMatch(/\.dark \{[^}]*--aura-color-focus-ring: #60A5FA;/s);
  // Fields take a soft edge; checkboxes and radios keep the 3:1 control border.
  expect(css).toMatch(/:root \{[^}]*--aura-color-border-field: #C4C4CC;/s);
  expect(css).toMatch(/\.dark \{[^}]*--aura-color-border-field: #404040;/s);
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
  expect(theme.light).toMatchObject({ success: '#059669', 'success-foreground': '#0A0A0F', ring: '#2563EB' });
  expect(theme.dark).toMatchObject({ warning: '#F5B544', 'warning-foreground': '#0A0A0A' });
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

// As the AuraData BI sidebar: white, a gray hover and active item. Same color for both hid the active item.
test('the shadcn sidebar is the container color and its accent stands out from it', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  for (const mode of ['light', 'dark']) {
    expect(theme[mode].sidebar).toBe(theme[mode].background);
    expect(theme[mode]['sidebar-accent']).not.toBe(theme[mode].sidebar);
  }
});

// Menus, lists and the command palette highlight a row with --accent on --popover. Both at fill-secondary left the
// row invisible in dark (#1F1F1F on #222222) and faint in light (#F5F5F5 on #FFFFFF).
test('the highlighted row of a menu stands out from the popover and from muted fills', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.light.accent).toBe('#EFEFF2');
  expect(theme.dark.accent).toBe('#2E2E2E');
  for (const mode of ['light', 'dark']) {
    expect(theme[mode].accent).not.toBe(theme[mode].popover);
    expect(theme[mode].accent).not.toBe(theme[mode].muted);
  }
  expect(read('shadcn.css')).toContain('--accent: var(--aura-color-fill-accent);');
});

// AuraData BI draws its charts with ECharts: echarts.registerTheme('auradata', theme.light).
test('echarts.json themes ECharts in light and dark from the tokens', () => {
  const { light, dark } = JSON.parse(read('echarts.json'));
  for (const theme of [light, dark]) {
    expect(theme.color).toHaveLength(8);
    expect(theme.color[0]).toBe('#2563EB');
    expect(theme.color[7]).toBe('#64748B');
    expect(theme.backgroundColor).toBe('transparent');
    expect(theme.textStyle.fontFamily).toBe("Outfit, -apple-system, 'Segoe UI', sans-serif");
  }
  const shadcn = JSON.parse(read('shadcn-theme.json'));
  expect(light.color).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map((n) => shadcn.light[`chart-${n}`]));

  expect(light.title.textStyle.color).toBe('#0A0A0F');
  expect(light.title.subtextStyle.color).toBe('#666666');
  expect(light.legend.textStyle.color).toBe('#666666');
  expect(light.tooltip).toMatchObject({ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5', textStyle: { color: '#0A0A0F' } });
  for (const axis of ['categoryAxis', 'valueAxis', 'timeAxis', 'logAxis']) {
    expect(light[axis]).toMatchObject({
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { lineStyle: { color: '#E5E5E5' } },
      axisLabel: { color: '#666666' },
      splitLine: { lineStyle: { color: ['#EDEDED'] } },
    });
  }

  expect(dark.title.textStyle.color).toBe('#F0F0F0');
  expect(dark.legend.textStyle.color).toBe('#A3A3A3');
  expect(dark.tooltip).toMatchObject({ backgroundColor: '#222222', borderColor: '#2E2E2E', textStyle: { color: '#F0F0F0' } });
  expect(dark.valueAxis).toMatchObject({
    axisLine: { lineStyle: { color: '#2E2E2E' } },
    axisLabel: { color: '#A3A3A3' },
  });
  expect(dark.valueAxis.splitLine.lineStyle.color[0]).not.toBe(light.valueAxis.splitLine.lineStyle.color[0]);
});

// A halo in the brand blue on every component a shadcn app installs: a solid 1px edge of --ring (3:1 and more)
// inside a soft 3px glow of it, composed with the elevation shadow; a transparent outline shows in forced colors.
const HALO = '0 0 0 1px var(--ring), 0 0 0 4px color-mix(in oklab, var(--ring) 25%, transparent)';

test('shadcn.css gives every component the focus halo', () => {
  const css = read('shadcn.css');
  // Plain elements (a link) keep an outline, in the brand blue.
  expect(css).toMatch(/@layer base \{\s*:focus-visible \{\s*outline: 2px solid var\(--ring\);\s*outline-offset: 2px;\s*\}/);
  // Unlayered, so it wins over the stock `outline-none` and `ring-*` utilities.
  const rule = css.match(/^:where\(\[class\*="focus-visible:ring-"\][^{]*:focus-visible[^{]*\{([^}]*)\}/m)[1];
  expect(rule).toContain('outline: 2px solid transparent;');
  expect(rule).toContain(`--tw-ring-shadow: ${HALO};`);
  expect(rule).toContain('box-shadow: var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow, 0 0 #0000);');
  // Scrolling viewports clip anything outside them: their outline goes inside.
  expect(css).toMatch(/:where\(\[data-slot\$="viewport"\]\):focus-visible \{\s*outline-offset: -2px;/);
});

test('shadcn-theme.json carries the same focus halo, red on an invalid field', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.css['@layer base'][':focus-visible']).toEqual({ outline: '2px solid var(--ring)', 'outline-offset': '2px' });
  const rings = Object.entries(theme.css).filter(([, rule]) => rule['--tw-ring-shadow'] === HALO);
  expect(rings).toHaveLength(1);
  expect(read('shadcn.css')).toContain(rings[0][0]);
  expect(theme.css['@layer base'][':where([aria-invalid="true"]):focus-visible, :where([aria-invalid="true"]):focus-within']).toEqual({
    '--ring': 'var(--destructive)',
  });
});

// A focused field turns its own border blue and glows: no second edge outside the border.
test('the theme gives a focused field a blue border and the glow alone', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  const [selector, rule] = Object.entries(theme.css).find(([key]) => key.includes('[data-slot="input"]'));
  for (const slot of ['textarea', 'select-trigger', 'native-select', 'input-group', 'combobox-chips']) {
    expect(selector).toContain(`[data-slot="${slot}"]`);
  }
  expect(rule).toEqual({
    'border-color': 'var(--ring)',
    '--tw-ring-shadow': '0 0 0 3px color-mix(in oklab, var(--ring) 25%, transparent)',
  });
  // After the halo, so a field wins over it.
  const keys = Object.keys(theme.css);
  expect(keys.indexOf(selector)).toBeGreaterThan(keys.findIndex((key) => key.includes('focus-visible:ring-')));
});

test('the theme gives fields a soft border', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.light['field-border']).toBe('#C4C4CC');
  expect(theme.dark['field-border']).toBe('#404040');
  expect(read('shadcn.css')).toContain('--field-border: var(--aura-color-border-field);');
  expect(theme.theme['color-field-border']).toBe('var(--field-border)');
});

// Unchecked checkbox and radio borders read 1.26:1 with --input; they take --control-border instead.
test('the theme gives checkboxes and radios a border that reads 3:1', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.light['control-border']).toBe('#858585');
  expect(theme.dark['control-border']).toBe('#707070');
  const rule = { '--input': 'var(--control-border)' };
  expect(theme.css['@layer base'][':where([data-slot="checkbox"], [data-slot="radio-group-item"])']).toEqual(rule);
  expect(read('shadcn.css')).toContain('--control-border: var(--aura-color-border-control);');
  expect(read('shadcn.css')).toMatch(/:where\(\[data-slot="checkbox"\], \[data-slot="radio-group-item"\]\) \{\s*--input: var\(--control-border\);/);
});

// Heatmaps and conditional cells: a one-hue sequential ramp and a two-arm diverging one, themed light and dark,
// beside the categorical chart-1..8 (which stay as they are).
const NINE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

test('tokens.css carries the sequential and diverging palettes in light and dark', () => {
  const css = read('tokens.css');
  for (const palette of ['sequential', 'diverging']) {
    for (const n of NINE) {
      expect(css).toMatch(new RegExp(`:root \\{[^}]*--aura-color-${palette}-${n}: #[0-9A-F]{6};`, 's'));
      expect(css).toMatch(new RegExp(`\\.dark \\{[^}]*--aura-color-${palette}-${n}: #[0-9A-F]{6};`, 's'));
    }
  }
  expect(css).toMatch(/:root \{[^}]*--aura-color-sequential-1: #DBEAFE;[^}]*--aura-color-sequential-9: #1E3A8A;/s);
  expect(css).toMatch(/\.dark \{[^}]*--aura-color-sequential-1: #172554;[^}]*--aura-color-sequential-9: #BFDBFE;/s);
  expect(css).toMatch(/:root \{[^}]*--aura-color-diverging-5: #E5E5E5;/s);
  expect(css).toMatch(/\.dark \{[^}]*--aura-color-diverging-5: #333333;/s);
});

test('shadcn gets the sequential and diverging palettes as variables and Tailwind colors', () => {
  const css = read('shadcn.css');
  const theme = JSON.parse(read('shadcn-theme.json'));
  for (const palette of ['sequential', 'diverging']) {
    for (const n of NINE) {
      expect(css).toContain(`--${palette}-${n}: var(--aura-color-${palette}-${n});`);
      expect(theme.theme[`color-${palette}-${n}`]).toBe(`var(--${palette}-${n})`);
    }
  }
  expect(theme.light).toMatchObject({ 'sequential-1': '#DBEAFE', 'diverging-1': '#991B1B', 'diverging-9': '#1E40AF' });
  expect(theme.dark).toMatchObject({ 'sequential-1': '#172554', 'diverging-1': '#FCA5A5', 'diverging-9': '#93C5FD' });
  // The categorical palette is unchanged.
  expect(theme.light['chart-1']).toBe('#2563EB');
  expect(Object.keys(theme.light).filter((name) => /^chart-\d$/.test(name))).toHaveLength(8);
});

// Colored toasts, conditional cells and soft badges: a tint, a border and a text of each status, from one scale.
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

test('tokens.css carries a 50-900 scale of each status, inverted in dark so 50 stays the faint tint', () => {
  const css = read('tokens.css');
  for (const status of ['success', 'warning', 'info', 'error']) {
    for (const step of STEPS) {
      expect(css).toMatch(new RegExp(`:root \\{[^}]*--aura-color-${status}-${step}: #[0-9A-F]{6};`, 's'));
      expect(css).toMatch(new RegExp(`\\.dark \\{[^}]*--aura-color-${status}-${step}: #[0-9A-F]{6};`, 's'));
    }
  }
  // Light is Tailwind's scale of each status color: success is emerald-600, error red-600.
  expect(css).toMatch(/:root \{[^}]*--aura-color-success-50: #ECFDF5;[^}]*--aura-color-success-600: #059669;/s);
  expect(css).toMatch(/:root \{[^}]*--aura-color-error-600: #DC2626;[^}]*--aura-color-error-900: #7F1D1D;/s);
  expect(css).toMatch(/\.dark \{[^}]*--aura-color-error-100: #450A0A;[^}]*--aura-color-error-900: #FECACA;/s);
});

test('shadcn gets the status scales as variables and Tailwind colors, destructive for error', () => {
  const css = read('shadcn.css');
  const theme = JSON.parse(read('shadcn-theme.json'));
  for (const [status, aura] of [['success', 'success'], ['warning', 'warning'], ['info', 'info'], ['destructive', 'error']]) {
    for (const step of STEPS) {
      expect(css).toContain(`--${status}-${step}: var(--aura-color-${aura}-${step});`);
      expect(theme.theme[`color-${status}-${step}`]).toBe(`var(--${status}-${step})`);
    }
  }
  expect(theme.light).toMatchObject({ 'success-700': '#047857', 'warning-50': '#FFFBEB', 'destructive-200': '#FECACA' });
  expect(theme.dark).toMatchObject({ 'success-700': '#34D399', 'info-900': '#BFDBFE' });
});

// Removed on purpose: the theme has no global compact density (the data table keeps its own) and no print styles.
test('the theme carries no global density and no print styles', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  for (const file of ['tokens.css', 'shadcn.css']) {
    expect(read(file)).not.toContain('@media print');
    expect(read(file)).not.toContain('data-density');
    expect(read(file)).not.toContain('density-compact');
  }
  expect(Object.keys(theme.css)).not.toContain('@media print');
  expect(Object.keys(theme.css)).not.toContain('@media screen');
});

const ELEVATION = ['raised', 'raised-hover', 'control', 'control-hover', 'pressed', 'sunken', 'overlay', 'modal'];
const SURFACES = ['raised', 'filled', 'grain', 'glass'];

// Depth from the Kepler kiosk app: a top-edge highlight, a contact and an ambient shadow, a soft surface gradient.
test('tokens.css carries the elevation scale and the surfaces in light and dark', () => {
  const css = read('tokens.css');
  const [root, dark] = css.split('\n.dark {');
  for (const block of [root, dark]) {
    for (const name of ELEVATION) expect(block).toMatch(new RegExp(`--aura-shadow-${name}: [^;]+;`));
    for (const name of SURFACES) expect(block).toMatch(new RegExp(`--aura-surface-${name}: [^;]+;`));
  }
  // The highlight: 90 % white in light, a 8-12 % white hairline in dark.
  expect(root).toMatch(/--aura-shadow-raised: inset 0 1px 0 rgb\(255 255 255 \/ 0\.9\),/);
  expect(dark).toMatch(/--aura-shadow-raised: inset 0 1px 0 rgb\(255 255 255 \/ 0\.08\),/);
  // Pressed and sunken are inset only: the element sinks.
  for (const block of [root, dark]) {
    expect(block).toMatch(/--aura-shadow-pressed: inset [^,;]+;/);
    expect(block).toMatch(/--aura-shadow-sunken: inset [^,;]+;/);
  }
  // The grain is opt-in and dark only.
  expect(root).toContain('--aura-surface-grain: none;');
  expect(dark).toMatch(/--aura-surface-grain: url\("data:image\/svg\+xml,/);
  // AuraData BI reads shadow-card and shadow-float through antd.json: they keep their values.
  expect(root).toContain('--aura-shadow-card: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -12px rgba(0, 0, 0, 0.08);');
  expect(dark).toContain('--aura-shadow-float: 0 16px 40px -12px rgba(0, 0, 0, 0.7), 0 2px 6px rgba(0, 0, 0, 0.4);');
});

test('shadcn gets the elevation and the surfaces as variables', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  const css = read('shadcn.css');
  for (const name of ELEVATION) {
    expect(css).toContain(`--elevation-${name}: var(--aura-shadow-${name});`);
    expect(theme.light[`elevation-${name}`]).toMatch(/\S/);
    expect(theme.dark[`elevation-${name}`]).not.toBe(theme.light[`elevation-${name}`]);
  }
  for (const name of SURFACES) expect(css).toContain(`--surface-${name}: var(--aura-surface-${name});`);
  expect(theme.light['surface-grain']).toBe('none');
});

// The stock shadcn card, left to shadcn, gets its depth from the theme; shadow-none on a card still wins.
test('the theme raises the stock card through --tw-shadow in the base layer', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.css['@layer base'][':where([data-slot="card"])']).toEqual({
    '--tw-shadow': 'var(--elevation-raised)',
    'box-shadow':
      'var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow, 0 0 #0000)',
    'background-image': 'var(--surface-raised)',
  });
  // The focus ring stays in the same base layer.
  expect(theme.css['@layer base'][':focus-visible']).toBeDefined();
});

// Shadows vanish in forced colors: raised, floating and modal surfaces keep an edge.
test('the theme outlines elevated surfaces in forced colors', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  const forced = theme.css['@media (forced-colors: active)'];
  expect(forced).toBeDefined();
  const [selector, rule] = Object.entries(forced)[0];
  expect(selector).toContain('[data-slot="card"]');
  for (const name of ['raised', 'overlay', 'modal']) expect(selector).toContain(`[class*="--elevation-${name})"]`);
  expect(rule.outline).toBe('1px solid CanvasText');
  expect(read('shadcn.css')).toContain('@media (forced-colors: active)');
});

// Frosted glass on floating overlays: translucent --popover + backdrop-filter, gated on @supports and off in forced colors.
test('the theme gives floating surfaces a frosted glass layer and disables it in forced colors', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  const css = read('shadcn.css');
  expect(theme.light['surface-glass']).toBe('rgb(255 255 255 / 0.55)');
  expect(theme.dark['surface-glass']).toBe('rgb(34 34 34 / 0.58)');
  const supports = theme.css['@supports (backdrop-filter: blur(1px))']?.['@layer base'];
  expect(supports).toBeDefined();
  const [selector, rule] = Object.entries(supports)[0];
  for (const slot of ['dropdown-menu-content', 'dropdown-menu-sub-content', 'context-menu-content', 'context-menu-sub-content', 'select-content', 'popover-content', 'combobox-content', 'hover-card-content', 'navigation-menu-popup', 'tour', 'chart-tooltip', 'data-table-selection-bar']) {
    expect(selector).toContain(`[data-slot="${slot}"]`);
  }
  expect(selector).toContain('[data-sonner-toast]:not([data-rich-colors="true"])');
  expect(rule['--popover']).toBe('var(--surface-glass)');
  expect(rule['--muted-foreground']).toContain('var(--popover-foreground)');
  expect(rule['backdrop-filter']).toBe('blur(18px) saturate(1.35)');
  expect(rule['-webkit-backdrop-filter']).toBe(rule['backdrop-filter']);
  expect(theme.css['@media (forced-colors: active)'][selector]).toMatchObject({
    '--popover': 'Canvas',
    '--normal-bg': 'Canvas',
    'backdrop-filter': 'none',
  });
  expect(css).toContain('@supports (backdrop-filter: blur(1px))');
});

// Concentric radii: nested cards step down cleanly and floating toolbars match inner buttons to outer radius minus padding.
test('the theme sets concentric radii on nested cards and floating toolbars', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  expect(theme.css[':where([data-slot="card"]) :where([data-slot="card"])']).toEqual({ 'border-radius': 'var(--radius-lg)' });
  expect(theme.css[':where([data-slot="data-table-selection-bar"]) :where([data-slot="button"])']['border-radius']).toContain('calc(var(--radius-xl)');
});

// Trigger-born popups enter smoothly from --transform-origin and exit faster; reduced motion drops duration to 0ms.
test('the theme animates popups from --transform-origin with faster exits and reduced-motion support', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  const openEntry = Object.entries(theme.css).find(([key]) => key.includes('[data-slot="dropdown-menu-content"]') && key.endsWith('[data-open]'));
  const closedEntry = Object.entries(theme.css).find(([key]) => key.includes('[data-slot="dropdown-menu-content"]') && key.endsWith('[data-closed]'));
  expect(openEntry).toBeDefined();
  expect(closedEntry).toBeDefined();
  expect(Number.parseInt(closedEntry[1]['--tw-animation-duration'], 10)).toBeLessThan(
    Number.parseInt(openEntry[1]['--tw-animation-duration'], 10),
  );
  const reduced = theme.css['@media (prefers-reduced-motion: reduce)'];
  expect(Object.values(reduced)[0]['--tw-animation-duration']).toBe('0ms');
});

// View Transitions for the theme toggle: disables default cross-fade only while data-theme-transition is active.
test('the theme carries the view-transition rules for theme switching', () => {
  const css = read('shadcn.css');
  expect(css).toContain(':root[data-theme-transition]::view-transition-new(root)');
  expect(css).toContain('mix-blend-mode: normal;');
});

// Skeleton shimmer, brand text selection, discrete scrollbars and smooth collapsible panels from the theme.
test('the theme carries skeleton shimmer, brand selection, discrete scrollbars and collapsible transitions', () => {
  const theme = JSON.parse(read('shadcn-theme.json'));
  const css = read('shadcn.css');
  expect(theme.light.selection).toBe('#DBEAFE');
  expect(theme.dark.selection).toBe('#1E3A8A');
  expect(theme.css['@layer base']['::selection']).toEqual({
    'background-color': 'var(--selection)',
    color: 'var(--foreground)',
  });
  expect(theme.css[':where([data-slot="skeleton"])'].animation).toContain('aura-skeleton-shimmer');
  expect(theme.css['@media (prefers-reduced-motion: reduce)'][':where([data-slot="skeleton"])'].animation).toBe('none');
  expect(theme.css['@layer base'][':where([data-slot="collapsible-content"])'].height).toBe('var(--collapsible-panel-height)');
  expect(css).toContain('@keyframes aura-skeleton-shimmer');
  expect(css).toContain('@keyframes aura-check-draw');
  expect(css).toContain('scrollbar-width: thin;');
});
