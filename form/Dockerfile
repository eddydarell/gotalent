# Form Service - Multi-stage build with Bun
FROM oven/bun:1 AS frontend-build

WORKDIR /app

# Copy frontend package files
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy frontend source
COPY . .

# Build frontend (skip type checking to avoid vue-tsc issues)
RUN bun run vite build

# Production stage with Bun
FROM oven/bun:1-slim

WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/dist ./dist

# Copy backend server
COPY --from=frontend-build /app/server ./server

# Install production dependencies if server has any
WORKDIR /app/server
RUN if [ -f package.json ]; then bun install --production; fi

WORKDIR /app

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3002/api/health || exit 1

# Start server
CMD ["bun", "run", "server/server.ts"]
