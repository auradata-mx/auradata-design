import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test } from 'vitest';

const require = createRequire(import.meta.url);

const LOGOS = ['horizontal', 'vertical'].flatMap((layout) =>
  ['color', 'negro', 'blanco', 'texto-degradado'].map((variant) => `${layout}-${variant}.svg`),
);
const MARKS = ['isotipo-color.svg', 'isotipo-negro.svg', 'isotipo-blanco.svg'];
const ICONS = [16, 32, 48, 180, 192, 512].map((size) => `favicon-${size}.png`);

test.each([...LOGOS, ...MARKS])('@auradata/tokens/assets/continua/%s is an SVG a product can import', (file) => {
  const svg = readFileSync(require.resolve(`@auradata/tokens/assets/continua/${file}`), 'utf8');
  expect(svg.startsWith('<svg')).toBe(true);
  expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/);
  expect(svg).not.toContain('Apache Software Foundation');
});

test.each(ICONS)('@auradata/tokens/assets/continua/%s is a PNG', (file) => {
  const png = readFileSync(require.resolve(`@auradata/tokens/assets/continua/${file}`));
  expect(png.subarray(1, 4).toString()).toBe('PNG');
});
