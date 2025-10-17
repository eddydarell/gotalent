# Scanner Service (Bun-based)
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Build frontend
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-slim
WORKDIR /app

# Copy dependencies and build
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/server.js ./server.js
COPY --from=base /app/package.json ./package.json

# Expose port
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3004/api/health || exit 1

# Start server
CMD ["bun", "run", "server.js"]
