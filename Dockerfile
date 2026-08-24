# Stage 1: Build static assets
FROM node:24-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_WS_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:2-alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
# CMD ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":80"]
