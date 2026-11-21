# The Storybook catalog and brand guide behind the AuraData sign-in page (Coolify: design.auradata.mx).
# Set SITE_PASSWORD (the team password) and SESSION_SECRET (32+ characters) in Coolify.
FROM node:26-slim AS build
WORKDIR /app
COPY . .
RUN npm ci --no-audit --no-fund \
  && npm run build -w @cristianruben-dev/auradata-tokens \
  && npm run build-storybook -w registry \
  && npm run build:login -w registry

FROM node:26-slim
WORKDIR /app
ENV NODE_ENV=production \
  PORT=8080 \
  STATIC_DIR=/app/storybook-static \
  LOGIN_DIR=/app/login-dist
COPY --from=build /app/registry/server/index.mjs /app/registry/server/index.mjs
COPY --from=build /app/registry/storybook-static /app/storybook-static
COPY --from=build /app/registry/login-dist /app/login-dist
# Private catalog: keep it out of search engines (the server also answers /robots.txt itself).
RUN printf 'User-agent: *\nDisallow: /\n' > /app/storybook-static/robots.txt
# Not root: the server only reads the built files, on an unprivileged port.
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/healthz').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "registry/server/index.mjs"]
