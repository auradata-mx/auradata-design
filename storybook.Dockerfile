# The Storybook catalog and brand guide as a static site (Coolify: design.auradata.mx).
FROM node:26-slim AS build
WORKDIR /app
COPY . .
RUN npm ci --no-audit --no-fund \
  && npm run build -w @cristianruben-dev/auradata-tokens \
  && npm run build-storybook -w registry

FROM nginx:1-alpine
COPY --from=build /app/registry/storybook-static /usr/share/nginx/html
# Private catalog: keep it out of search engines even behind basic auth.
RUN printf 'User-agent: *\nDisallow: /\n' > /usr/share/nginx/html/robots.txt
EXPOSE 80
