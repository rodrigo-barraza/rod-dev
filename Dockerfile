# ============================================================
# rod.dev — Multi-stage Docker Build
# Uses Next.js standalone output for minimal image size
# ============================================================

# --- Base ---
FROM node:22-alpine AS base

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add --no-cache git
RUN npm ci

# --- Build ---
FROM base AS builder
WORKDIR /app

# Vault credentials — needed at build time for next.config.ts
ARG VAULT_SERVICE_URL=http://192.168.86.2:5599
ENV VAULT_SERVICE_URL=$VAULT_SERVICE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=VAULT_SERVICE_TOKEN \
  export VAULT_SERVICE_TOKEN=$(cat /run/secrets/VAULT_SERVICE_TOKEN 2>/dev/null) && \
  npx next build --webpack

# --- Production ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone server and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
