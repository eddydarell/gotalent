#!/bin/sh

# Docker entrypoint script for Go Talent PWA
# This script ensures the database is always properly initialized and seeded

echo "🚀 Starting Go Talent PWA..."

# Change to app directory
cd /app

# Check if database exists, if not create it
if [ ! -f "participants.db" ]; then
    echo "📦 Database not found, creating new database..."
    npm run init-db
else
    echo "📦 Database found, checking if seeding is needed..."
    
    # Check if the database has data
    PARTICIPANT_COUNT=$(sqlite3 participants.db "SELECT COUNT(*) FROM participants;" 2>/dev/null || echo "0")
    
    if [ "$PARTICIPANT_COUNT" -eq "0" ]; then
        echo "📦 Database is empty, seeding data..."
        npm run init-db
    else
        echo "📦 Database contains $PARTICIPANT_COUNT participants, skipping seed"
    fi
fi

# Ensure database file has proper permissions
chmod 664 participants.db 2>/dev/null || true

# Force re-seeding if FORCE_SEED environment variable is set
if [ "$FORCE_SEED" = "true" ]; then
    echo "🔄 FORCE_SEED is enabled, re-initializing database..."
    rm -f participants.db
    npm run init-db
fi

# Health check - verify database is accessible
if ! sqlite3 participants.db "SELECT 1;" >/dev/null 2>&1; then
    echo "❌ Database health check failed!"
    exit 1
fi

echo "✅ Database initialization complete"
echo "🌐 Starting web server..."

# Execute the main command
exec "$@"
