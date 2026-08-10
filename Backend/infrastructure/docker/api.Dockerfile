# Produktions-Image der NestJS-API. Build-Kontext: Backend/ (Workspace-Root).
# Aufruf: docker build -f infrastructure/docker/api.Dockerfile -t cms-api .

# --- Build-Stage ---
FROM node:22.23.1-slim@sha256:6c74791e557ce11fc957704f6d4fe134a7bc8d6f5ca4403205b2966bd488f6b3 AS builder
WORKDIR /app

# Nur die für die API nötigen Workspaces kopieren (kleinerer Build-Kontext).
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN npm ci
RUN npm run build:packages && npm run build:api
RUN npm prune --omit=dev && npm cache clean --force

# --- Runtime-Stage ---
FROM node:22.23.1-slim@sha256:6c74791e557ce11fc957704f6d4fe134a7bc8d6f5ca4403205b2966bd488f6b3 AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Non-root-Benutzer.
RUN groupadd --system cms \
  && useradd --system --gid cms --home-dir /app cms \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Gebautes Ergebnis + Abhängigkeiten übernehmen. Die @yunity/*-Workspace-Pakete
# sind als Symlinks in node_modules hinterlegt und über packages/ aufgelöst.
COPY --chown=cms:cms --from=builder /app/node_modules ./node_modules
COPY --chown=cms:cms --from=builder /app/packages ./packages
COPY --chown=cms:cms --from=builder /app/package.json ./package.json
COPY --chown=cms:cms --from=builder /app/apps/api/dist ./apps/api/dist
COPY --chown=cms:cms --from=builder /app/apps/api/package.json ./apps/api/package.json

USER cms
EXPOSE 4000

# Health-Check ohne curl (Node 22 hat globales fetch). Port aus $PORT
# (Railway/Render injizieren einen eigenen Port), sonst 4000.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "const p=process.env.PORT||4000;fetch('http://localhost:'+p+'/api/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/api/dist/main.js"]
