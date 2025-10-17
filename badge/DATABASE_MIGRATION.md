# SQLite Database Migration

This document explains how to migrate from loading all participants in memory (JSON format) to using a SQLite database.

## What Changed

### Before
- All participant data was loaded from `data/participants.json` into memory
- Frontend searched through the array for participant login
- Memory usage scaled with number of participants

### After
- Participant data is stored in a SQLite database (`participants.db`)
- API server handles database queries
- Frontend makes HTTP requests to find participants
- Much more scalable and efficient

## Database Schema

```sql
CREATE TABLE participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    contact_number TEXT,
    how_heard TEXT,
    expertise_domain TEXT,
    gender TEXT,
    objectives TEXT,
    expectations TEXT,
    drink_preference TEXT,
    timestamp TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON participants(email);
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the database:**
   ```bash
   npm run init-db
   ```
   This will:
   - Create `participants.db` SQLite database
   - Import all data from `data/participants.json`
   - Create necessary indexes

3. **Build the frontend:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm run server
   ```
   Or use the combined command:
   ```bash
   npm start
   ```

## API Endpoints

### GET /api/participants/email/:email
Find a participant by email address.

**Response:**
```json
{
  "id": 1,
  "name": "participant_name",
  "email": "participant@example.com",
  "phone": "+243 123 456 789",
  "company": "Mining Corp",
  "position": "Engineer",
  "howHeard": "LinkedIn",
  "gender": "Homme",
  "objectives": "Networking",
  "expectations": "Learning",
  "timestamp": "2025-07-07T23:43:37.000Z"
}
```

### GET /api/participants/:id
Find a participant by ID.

### GET /api/participants/stats/count
Get total number of participants.

**Response:**
```json
{
  "count": 4178
}
```

### GET /api/participants/search
Search participants with query parameters:
- `q`: Search in email and expertise domain
- `domain`: Filter by expertise domain
- `gender`: Filter by gender
- `limit`: Limit results (default: 50)

## Development

For development with hot reloading:

1. Start Vite dev server:
   ```bash
   npm run dev
   ```

2. In another terminal, start the API server:
   ```bash
   npm run server
   ```

The frontend will run on `http://localhost:5173` and proxy API calls to the server.

## Benefits

1. **Memory Efficiency**: No longer loads all participants into memory
2. **Scalability**: Database queries are much faster than array searches
3. **Data Integrity**: SQLite provides ACID compliance
4. **Indexing**: Email lookups are indexed for fast searches
5. **API Ready**: Easy to extend with more endpoints
6. **Concurrent Access**: Multiple users can access simultaneously

## Migration Notes

- The original `data/participants.json` file is preserved
- Database initialization is idempotent (safe to run multiple times)
- All existing functionality remains the same from user perspective
- Frontend gracefully handles API errors
