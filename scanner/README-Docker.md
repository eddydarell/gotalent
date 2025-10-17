# Go Talent Scanner - Docker Setup

This application has been containerized for easy deployment and development.

## Docker Configuration Changes

### Vite Configuration Updates
- Modified `vite.config.js` to use **Network-First** caching strategy
- Assets are now fetched from server first, then fallback to cache
- Separate caching strategies for different asset types:
  - **JS/CSS/HTML**: Network-first with 3s timeout
  - **API calls**: Network-first with 3s timeout  
  - **Images**: Cache-first (for performance)

## Quick Start

### Production Deployment
```bash
# Build and run the production container
npm run docker:prod

# Or manually:
docker-compose up --build -d
```

### Development with Hot Reloading
```bash
# Start development environment
npm run docker:dev

# Or manually:
docker-compose --profile dev up --build
```

### Manual Docker Commands
```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

## Ports
- **3002**: Backend API server
- **3003**: Frontend application

## Data Persistence
The SQLite database is mounted as a volume at `./data:/app/data` to persist data between container restarts.

## Health Checks
The production container includes health checks to monitor application status.

## Cache Strategy Details

The updated Vite configuration ensures fresh assets by:

1. **Network-First for Critical Assets**: JS, CSS, and HTML files are fetched from the server first
2. **Short Network Timeout**: 3-second timeout before falling back to cache
3. **API Priority**: API calls always try the network first
4. **Image Optimization**: Static images use cache-first for better performance

This prevents stale assets while maintaining good performance for static resources.
