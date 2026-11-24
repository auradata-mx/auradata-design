# design.auradata.mx (Coolify): the docs site at the root, the Storybook workbench under /storybook/ and the
# registry items under /r/. The file keeps its name because Coolify builds from it.
FROM node:26-slim AS build
WORKDIR /app
COPY . .
# Storybook builds with relative paths (./assets, ./sb-manager), so the same build serves from /storybook/.
# The docs build copies the Continua logos to out/brand/continua, where the Logo stories also read them.
RUN npm ci --no-audit --no-fund \
  && npm run build -w @auradata/tokens \
  && npm run registry -w registry \
  && npm run build-storybook -w registry \
  && npm run build -w docs

# nginx as the unprivileged user, on port 8080 (Coolify's exposed port).
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY registry/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/docs/out /usr/share/nginx/html
COPY --from=build /app/registry/storybook-static /usr/share/nginx/html/storybook
COPY --from=build /app/registry/public/r /usr/share/nginx/html/r
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
