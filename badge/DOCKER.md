# Go Talent PWA - Docker Setup

This document provides instructions for running the Go Talent PWA using Docker.

## 🐳 Docker Configuration

The application is fully containerized with automatic database seeding on startup.

### Features

- **Automatic Database Seeding**: The database is always initialized and seeded when the container starts
- **Health Checks**: Built-in health monitoring for container orchestration
- **Persistent Data**: Database data persists between container restarts
- **Production Optimized**: Multi-stage build with Alpine Linux for minimal image size

## 📦 Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Using Docker directly

```bash
# Build the image
docker build -t gotalent-pwa .

# Run the container
docker run -p 3000:3000 \
  -v gotalent-data:/app/participants.db \
  --name gotalent-app \
  gotalent-pwa

# Run with forced database re-seeding
docker run -p 3000:3000 \
  -e FORCE_SEED=true \
  -v gotalent-data:/app/participants.db \
  --name gotalent-app \
  gotalent-pwa
```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Application port | `3000` | No |
| `NODE_ENV` | Node environment | `production` | No |
| `FORCE_SEED` | Force database re-seeding | `false` | No |

## 📊 Database Seeding

The application automatically handles database initialization:

1. **First Run**: Creates database and seeds with data from `/data/participants.json`
2. **Subsequent Runs**: Checks if data exists, skips seeding if populated
3. **Force Seed**: Set `FORCE_SEED=true` to recreate and reseed database

### Seeding Process

```bash
# The container automatically:
# 1. Checks for existing database
# 2. Creates tables if needed
# 3. Seeds data if database is empty
# 4. Verifies database health
# 5. Starts the web server
```

## 🏥 Health Monitoring

Health check endpoint: `GET /api/health`

Response example:

```json
{
  "status": "healthy",
  "timestamp": "2025-08-03T10:30:00.000Z",
  "database": "connected",
  "participants": 42
}
```

## 📁 Data Persistence

### Volume Mounting

```yaml
volumes:
  # Persist database file
  - gotalent-data:/app/participants.db
  
  # Optional: Mount seed data (read-only)
  - ./data:/app/data:ro
```

### Backup Database

```bash
# Copy database from running container
docker cp gotalent-app:/app/participants.db ./backup.db

# Restore database to container
docker cp ./backup.db gotalent-app:/app/participants.db
```

## 🔄 Development Workflow

### Local Development with Docker

```bash
# Development with live reload (if needed)
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  node:18-alpine \
  sh -c "npm install && npm run dev"
```

### Production Deployment

```bash
# Build production image
docker build -t gotalent-pwa:latest .

# Deploy with restart policy
docker run -d \
  --name gotalent-prod \
  --restart unless-stopped \
  -p 80:3000 \
  -v gotalent-prod-data:/app/participants.db \
  gotalent-pwa:latest
```

## 🐛 Troubleshooting

### Database Issues

```bash
# Check database status
docker exec gotalent-app sqlite3 participants.db ".tables"

# View participant count
docker exec gotalent-app sqlite3 participants.db "SELECT COUNT(*) FROM participants;"

# Force database recreation
docker run --rm -e FORCE_SEED=true gotalent-pwa
```

### Container Logs

```bash
# View application logs
docker logs gotalent-app

# Follow logs in real-time
docker logs -f gotalent-app

# View last 100 lines
docker logs --tail 100 gotalent-app
```

### Performance Monitoring

```bash
# Container resource usage
docker stats gotalent-app

# Health check status
curl http://localhost:3000/api/health
```

## 🚀 Deployment Options

### Docker Swarm

```yaml
version: '3.8'
services:
  gotalent:
    image: gotalent-pwa:latest
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
    ports:
      - "3000:3000"
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gotalent-pwa
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gotalent-pwa
  template:
    metadata:
      labels:
        app: gotalent-pwa
    spec:
      containers:
      - name: gotalent-pwa
        image: gotalent-pwa:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

## 📝 Notes

- Database file is stored at `/app/participants.db` inside the container
- Seed data should be placed in `/app/data/participants.json`
- Container runs as root for SQLite file permissions
- Application serves static files from `/app/dist`
- Health checks run every 30 seconds in docker-compose
