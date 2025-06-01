# ────────────────────────────────────────────────────────────────
#  Equorn – Reproducible Build & Runtime Image
#  --------------------------------------------------------------
#  • Multi-stage build: “builder” compiles TypeScript; “runtime”
#    ships only production artefacts.
#  • Node v20 (LTS) with Alpine for a small footprint.
#  • pnpm is managed via Corepack and pinned for deterministic
#    dependency resolution.
# ────────────────────────────────────────────────────────────────
#  Build with:   docker build -t equorn:latest .
#  Run  with:   docker run --init -p 3000:3000 --env-file .env equorn
# ────────────────────────────────────────────────────────────────

############################
# 1) Builder stage
############################
FROM node:20-alpine AS builder

# ---------- 1.1 Shared metadata ----------
LABEL org.opencontainers.image.title="Equorn" \
      org.opencontainers.image.description="Generative myth-engine" \
      org.opencontainers.image.version="1.0.0"

ENV NODE_ENV=production \
    PNPM_HOME=/usr/local/pnpm

# ---------- 1.2 System deps ----------
RUN apk add --no-cache \
      git                \  # needed for certain post-install scripts
      dumb-init             # minimal init system for PID 1

# ---------- 1.3 pnpm (pinned) ----------
# Node 20 bundles Corepack; use it to activate a specific pnpm version.
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# ---------- 1.4 Workdir ----------
WORKDIR /usr/src/app

# ---------- 1.5 Dependency layer (cache-friendly) ----------
# Copy only manifest files first for better layer caching.
COPY pnpm-workspace.yaml ./
COPY package.json ./
# Copy every package.json inside the workspace (globs are safe here).
COPY packages/*/package.json ./packages/*/

# Install **production-only** deps to keep image small.
RUN pnpm install --frozen-lockfile --prod

# ---------- 1.6 Copy source & build ----------
COPY . .
RUN pnpm run build      # compiles TypeScript, Next.js, etc.

############################
# 2) Runtime stage
############################
FROM node:20-alpine AS runtime

ENV NODE_ENV=production \
    PNPM_HOME=/usr/local/pnpm

RUN apk add --no-cache dumb-init && \
    corepack enable && corepack prepare pnpm@8.15.5 --activate

WORKDIR /usr/src/app

# ---------- 2.1 Copy compiled artefacts ----------
COPY --from=builder /usr/src/app .

# ---------- 2.2 Expose & default command ----------
EXPOSE 3000   # Web dashboard
CMD ["dumb-init", "pnpm", "start"]   # Launch CLI & dashboard
