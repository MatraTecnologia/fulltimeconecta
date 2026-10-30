# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache --update libc6-compat \
    || apk add --no-cache --update \
    --repository=https://mirror.math.princeton.edu/pub/alpinelinux/v3.23/main \
    --repository=https://mirror.math.princeton.edu/pub/alpinelinux/v3.23/community \
    libc6-compat

# postinstall roda `prisma generate` — schema e config precisam existir antes do npm ci
COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

# ─── Stage 2: builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/lib/generated ./lib/generated
COPY . .

# R2_PUBLIC_URL é lido no next.config (images.remotePatterns) — passe como build arg no EasyPanel
ARG R2_PUBLIC_URL
ENV R2_PUBLIC_URL=$R2_PUBLIC_URL

RUN npm run build

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME=0.0.0.0

# Usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Copia somente o necessário do standalone build
COPY --from=builder /app/public                        ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

USER nextjs

EXPOSE 80

CMD ["node", "server.js"]
