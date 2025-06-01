FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10

# Create app directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/cli/package.json ./packages/cli/package.json
COPY packages/web/package.json ./packages/web/package.json
COPY packages/templates/package.json ./packages/templates/package.json

RUN pnpm install --frozen-lockfile

# Build the app
FROM deps AS builder
COPY . .
RUN pnpm build

# Production image
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=builder /app/packages/cli/dist ./packages/cli/dist
COPY --from=builder /app/packages/cli/node_modules ./packages/cli/node_modules
COPY --from=builder /app/packages/web/.next ./packages/web/.next
COPY --from=builder /app/packages/web/public ./packages/web/public
COPY --from=builder /app/packages/web/node_modules ./packages/web/node_modules
COPY --from=builder /app/packages/templates ./packages/templates

COPY pnpm-workspace.yaml package.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/cli/package.json ./packages/cli/package.json
COPY packages/web/package.json ./packages/web/package.json
COPY packages/templates/package.json ./packages/templates/package.json

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["pnpm", "dev"]
