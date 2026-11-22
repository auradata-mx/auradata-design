import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const packageRoot = resolve(import.meta.dirname, '..');
let outDir;
let themes;

beforeAll(() => {
  outDir = mkdtempSync(join(tmpdir(), 'auradata-contrast-'));
  execFileSync(process.execPath, ['build.mjs', '--out', outDir], { cwd: packageRoot });
  const css = readFileSync(join(outDir, 'tokens.css'), 'utf8');
  const variables = (selector) =>
    Object.fromEntries(
      [...css.match(new RegExp(`${selector} \\{([^}]*)\\}`, 's'))[1].matchAll(/--aura-color-([\w-]+): (#[0-9A-Fa-f]{6});/g)].map(
        (match) => [match[1], match[2]],
      ),
    );
  const light = variables(':root');
  themes = { light, dark: { ...light, ...variables('\\.dark') } };
});

afterAll(() => {
  rmSync(outDir, { recursive: true, force: true });
});

/** WCAG 2.2 relative luminance of a #RRGGBB color. */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** WCAG AA for body text. */
const AA = 4.5;

const SURFACES = ['bg-layout', 'bg-container', 'bg-elevated', 'fill-secondary'];
const TEXTS = ['text', 'text-secondary', 'text-tertiary', 'link'];
/** Fills that carry text on top: the button, badge and toast colors. */
const FILLS = ['primary', 'info', 'success', 'warning', 'error'];

const pairs = [
  ...TEXTS.flatMap((text) => SURFACES.map((surface) => [text, surface])),
  // A highlighted menu row: its label (accent-foreground) and its shortcut or description (muted-foreground).
  ['text', 'fill-accent'],
  ['text-secondary', 'fill-accent'],
  ...FILLS.map((fill) => [`${fill}-foreground`, fill]),
];

test('the contrast formula matches the WCAG reference values', () => {
  expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  expect(contrast('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
});

describe.each(['light', 'dark'])('%s theme', (name) => {
  test.each(pairs)('%s on %s passes WCAG AA', (text, background) => {
    const theme = themes[name];
    expect(theme[text], `--aura-color-${text}`).toBeDefined();
    expect(theme[background], `--aura-color-${background}`).toBeDefined();
    const ratio = contrast(theme[text], theme[background]);
    expect(ratio, `${theme[text]} on ${theme[background]} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
  });
});

/** WCAG 1.4.11: the boundary of a control (unchecked checkbox and radio) against what surrounds it. */
const NON_TEXT = 3;

describe.each(['light', 'dark'])('%s theme controls', (name) => {
  test.each(SURFACES)('border-control on %s passes WCAG 1.4.11', (surface) => {
    const theme = themes[name];
    expect(theme['border-control'], '--aura-color-border-control').toBeDefined();
    const ratio = contrast(theme['border-control'], theme[surface]);
    expect(ratio, `${theme['border-control']} on ${theme[surface]} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(NON_TEXT);
  });
});

const ramp = (theme, palette) => [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => theme[`${palette}-${n}`]);

/**
 * The label on a heatmap cell: steps 1-5 of the sequential palette take the text color (foreground), 6-9 the
 * page color (background); on the diverging palette, the middle steps 3-7 take the text, the ends 1, 2, 8, 9 the
 * page. lib/chart-palette picks it the same way.
 */
const ON_SEQUENTIAL = (n) => (n <= 5 ? 'text' : 'bg-container');
const ON_DIVERGING = (n) => (n >= 3 && n <= 7 ? 'text' : 'bg-container');

describe.each(['light', 'dark'])('%s theme data palettes', (name) => {
  test('the sequential palette moves away from the page step by step', () => {
    const theme = themes[name];
    const steps = ramp(theme, 'sequential').map((color) => contrast(color, theme['bg-container']));
    for (let n = 1; n < steps.length; n++) expect(steps[n], `sequential-${n + 1}`).toBeGreaterThan(steps[n - 1]);
  });

  test('the diverging palette is nearest the page at its neutral middle and moves away on both arms', () => {
    const theme = themes[name];
    const steps = ramp(theme, 'diverging').map((color) => contrast(color, theme['bg-container']));
    for (let n = 0; n < 4; n++) {
      expect(steps[n], `diverging-${n + 1}`).toBeGreaterThan(steps[n + 1]);
      expect(steps[8 - n], `diverging-${9 - n}`).toBeGreaterThan(steps[7 - n]);
      // Equal steps per arm: the same distance from neutral reads about the same on both sides.
      expect(Math.abs(Math.log(steps[n] / steps[8 - n])), `diverging-${n + 1} vs ${9 - n}`).toBeLessThan(0.15);
    }
  });

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9])('a label on step %i of each data palette passes WCAG AA', (n) => {
    const theme = themes[name];
    for (const [palette, on] of [['sequential', ON_SEQUENTIAL], ['diverging', ON_DIVERGING]]) {
      const [fill, text] = [theme[`${palette}-${n}`], theme[on(n)]];
      expect(fill, `--aura-color-${palette}-${n}`).toBeDefined();
      const ratio = contrast(text, fill);
      expect(ratio, `${text} on ${palette}-${n} ${fill} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
    }
  });
});
