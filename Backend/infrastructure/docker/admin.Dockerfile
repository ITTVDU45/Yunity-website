# Produktions-Image des Next.js-Admin-Dashboards. Build-Kontext: cms/.
# Aufruf: docker build -f infrastructure/docker/admin.Dockerfile -t cms-admin .

# --- Build-Stage ---
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/admin ./apps/admin

RUN npm ci
RUN npm run build:packages && npm run build:admin

# --- Runtime-Stage ---
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN groupadd --system cms && useradd --system --gid cms --home-dir /app cms

# Vollständiger Workspace-Kontext, damit `next start` die @cms/*-Pakete auflöst.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/admin ./apps/admin

USER cms
EXPOSE 4100

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://localhost:4100/login').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# next start bindet an 0.0.0.0; Port aus dem package-Skript (-p 4100).
CMD ["npm", "run", "start", "-w", "@cms/admin"]
