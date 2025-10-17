# Backend Dockerfile
FROM denoland/deno:1.42.4

WORKDIR /app

# Copy deno configuration
COPY deno.json .

# Cache dependencies
COPY server.ts migrate.ts ./
RUN deno cache server.ts migrate.ts

# Copy all files
COPY . .

# Run migrations
RUN deno run --allow-read --allow-write --allow-env migrate.ts

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "server.ts"]
