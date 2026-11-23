# The public Storybook (catalog and brand guide) and the registry items under /r/ (Coolify: design.auradata.mx).
FROM node:26-slim AS build
WORKDIR /app
COPY . .
RUN npm ci --no-audit --no-fund \
  && npm run build -w @cristianruben-dev/auradata-tokens \
  && npm run registry -w registry \
  && npm run build-storybook -w registry

# nginx as the unprivileged user, on port 8080 (Coolify's exposed port).
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY registry/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/registry/storybook-static /usr/share/nginx/html
COPY --from=build /app/registry/public/r /usr/share/nginx/html/r
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
