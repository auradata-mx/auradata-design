'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { blockPath, type BlockName } from './block-catalog';

const viewports = [
  { label: 'Escritorio', width: 1024, height: 640 },
  { label: 'Tableta', width: 768, height: 640 },
  { label: 'Teléfono', width: 390, height: 680 },
] as const;

const canvasId = 'block-preview-canvas';
const placeholderId = 'block-preview-placeholder';
const canvasStyles = `
  /* Hide only the docs layout, not overlays that the block portals to the body. */
  body > :has(#${placeholderId}:target),
  body:has(> #${canvasId}) > :has(#${placeholderId}) { display: none !important; }
  html:has(#${placeholderId}:target), html:has(body > #${canvasId}) { scrollbar-gutter: auto; }
`;

/**
 * Load the same static page in an iframe so CSS breakpoints and window.matchMedia
 * both see the preview width. The query selects the canvas; the fragment hides
 * the docs chrome until hydration. Neither requires a separate export route.
 */
export function BlockViewport({
  name,
  title,
  code,
  children,
}: {
  name: BlockName;
  title: string;
  code: ReactNode;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<'pending' | 'docs' | 'canvas'>('pending');
  const [viewport, setViewport] = useState<(typeof viewports)[number]>(viewports[0]);

  useEffect(() => {
    const embedded = window.self !== window.top && new URLSearchParams(location.search).get('preview') === '1';
    if (!embedded) {
      setViewport(viewports.find((size) => size.width <= window.innerWidth) ?? viewports[2]);
    }
    setMode(embedded ? 'canvas' : 'docs');
  }, []);

  if (mode === 'canvas') {
    return (
      <>
        <style>{canvasStyles}</style>
        <span id={placeholderId} hidden />
        {createPortal(
          <div id={canvasId} className="min-h-svh w-full bg-background text-foreground">
            {children}
          </div>,
          document.body,
        )}
      </>
    );
  }

  return (
    <>
      <style>{canvasStyles}</style>
      {mode === 'pending' && <span id={placeholderId} hidden />}
      <Tabs items={['Vista previa', 'Código']} className="not-prose min-w-0">
        <Tab value="Vista previa" className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
            <div role="group" aria-label="Tamaño de la vista previa" className="flex flex-wrap gap-1">
              {viewports.map((size) => (
                <button
                  key={size.width}
                  type="button"
                  aria-pressed={size === viewport}
                  onClick={() => setViewport(size)}
                  className="rounded-md px-2.5 py-1.5 text-sm text-fd-muted-foreground hover:bg-fd-accent aria-pressed:bg-fd-accent aria-pressed:font-medium aria-pressed:text-fd-accent-foreground"
                >
                  {size.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-xs text-fd-muted-foreground">{viewport.width} × {viewport.height}</span>
          </div>
          <div className="overflow-x-auto bg-fd-muted/50">
            {mode === 'docs' ? (
              <iframe
                title={`Vista previa: ${title}`}
                src={`${blockPath(name)}?preview=1#${placeholderId}`}
                width={viewport.width}
                height={viewport.height}
                className="mx-auto block max-w-none bg-background"
              />
            ) : (
              <div style={{ height: viewport.height }} aria-hidden />
            )}
          </div>
        </Tab>
        <Tab value="Código" className="p-0">
          {code}
        </Tab>
      </Tabs>
    </>
  );
}
