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
