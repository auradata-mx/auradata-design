import { source } from '@docs/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Static mode: the index is built once into out/api/search and searched in the browser.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'spanish',
});
