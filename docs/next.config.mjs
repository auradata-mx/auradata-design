import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // A static site (out/), served by nginx: no Node.js server.
  output: 'export',
  reactStrictMode: true,
  // `/docs/installation/` -> `out/docs/installation/index.html`, so any static server finds the page.
  trailingSlash: true,
  // The repository root, so the registry components under ../registry/src are part of the build.
  turbopack: {
    root: new URL('..', import.meta.url).pathname,
  },
};

export default withMDX(config);
