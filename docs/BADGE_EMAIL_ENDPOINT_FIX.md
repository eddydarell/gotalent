# Badge Service Email Endpoint Fix

**Date**: October 17, 2025  
**Issue**: GET request to `/api/participants/email/:email` returned 404  
**Status**: ✅ **RESOLVED**

## Problem

Badge service did not support GET requests with email in the URL path:
```
GET http://localhost:13003/api/participants/email/eddydarell%40gmail.com
Result: 404 Not Found
```

### Root Cause

The badge service only had a POST endpoint for email lookup:
- ✅ `POST /api/participants/email` with `{"email": "..."}` in body
- ❌ `GET /api/participants/email/:email` - Not implemented

This prevented direct URL-based email queries commonly used in frontend applications.

## Solution

Added a new GET endpoint that accepts email as a URL parameter while keeping the POST endpoint for backward compatibility.

### New Route Added

```javascript
// API: Get participant by email (GET with email in URL path)
if (path.startsWith("/api/participants/email/") && req.method === "GET") {
  const email = decodeURIComponent(path.split("/api/participants/email/")[1]);
  try {
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const participant = db.query("SELECT * FROM participants WHERE LOWER(email) = LOWER(?)").get(email);
    
    if (!participant) {
      return new Response(
        JSON.stringify({ error: "Participant not found", email: email }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(transformParticipant(participant)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Database query error:", err);
    return new Response(
      JSON.stringify({ error: "Database query failed", details: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
```

### Key Features

1. **URL Decoding**: Automatically decodes URL-encoded email addresses (`%40` → `@`)
2. **Case-Insensitive**: Uses `LOWER(email) = LOWER(?)` for case-insensitive matching
3. **Error Details**: Returns email in 404 response for debugging
4. **Backward Compatible**: Original POST endpoint still works

## Testing Results

### Test 1: GET with Email in URL Path ✅

**Request:**
```bash
GET http://localhost:13003/api/participants/email/eddydarell%40gmail.com
```

**Response:**
```json
{
  "id": 2,
  "name": "Eddy Ntambwe",
  "email": "eddydarell@gmail.com",
  "phone": "+46761381488",
  "company": "Capgemini",
  "position": "Software engineer",
  "gender": "M",
  "education": "Bachelor",
  "experience": 10,
  "registrationDate": "2025-10-17 12:20:16",
  "status": "registered"
}
```

### Test 2: Through Caddy Proxy ✅

**Request:**
```bash
GET http://localhost:13000/badge/api/participants/email/eddydarell%40gmail.com
```

**Response:** ✅ Same as Test 1 (works through proxy)

### Test 3: POST Endpoint (Backward Compatibility) ✅

**Request:**
```bash
POST http://localhost:13003/api/participants/email
Content-Type: application/json

{"email": "eddydarell@gmail.com"}
```

**Response:** ✅ Same result (POST method still works)

## API Endpoints Summary

### Badge Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/participants` | Get all participants |
| GET | `/api/participants/:id` | Get participant by ID |
| **GET** | **`/api/participants/email/:email`** | **Get participant by email (NEW)** |
| POST | `/api/participants/email` | Get participant by email (legacy) |
| GET | `/api/participants/search?q=term` | Search participants |
| GET | `/api/stats` | Get statistics |
| GET | `/api/count` | Get participant count |
| GET | `/api/health` | Health check |

## Usage Examples

### 1. From Frontend (Recommended)

```javascript
// GET request with email in URL
const email = 'eddydarell@gmail.com';
const response = await fetch(`http://localhost:13003/api/participants/email/${encodeURIComponent(email)}`);
const participant = await response.json();
```

### 2. From cURL

```bash
# URL-encode the @ symbol as %40
curl "http://localhost:13003/api/participants/email/eddydarell%40gmail.com"

# Or use single quotes to avoid shell interpretation
curl 'http://localhost:13003/api/participants/email/eddydarell@gmail.com'
```

### 3. Through Caddy Proxy

```bash
curl "http://localhost:13000/badge/api/participants/email/eddydarell%40gmail.com"
```

### 4. Legacy POST Method (Still Supported)

```bash
curl -X POST http://localhost:13003/api/participants/email \
  -H "Content-Type: application/json" \
  -d '{"email":"eddydarell@gmail.com"}'
```

## Benefits

### 1. RESTful Design ✅
- GET requests for data retrieval (standard REST practice)
- URL parameters for resource identification
- More intuitive API design

### 2. Frontend-Friendly ✅
- Easy to use with `fetch()` or `axios`
- No need to construct request body
- Works with standard HTML links

### 3. Cacheable ✅
- GET requests can be cached by browsers
- Better performance for repeated lookups
- CDN/proxy caching possible

### 4. Debuggable ✅
- Easy to test in browser address bar
- Can be bookmarked
- Simpler to share and document

### 5. Backward Compatible ✅
- Old POST endpoint still works
- No breaking changes
- Gradual migration path

## URL Encoding

When passing email addresses in URLs, special characters must be URL-encoded:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `+` | `%2B` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `&` | `%26` |

**JavaScript:**
```javascript
const encodedEmail = encodeURIComponent('user@example.com');
// Result: 'user%40example.com'
```

**Browser:** Automatically handled by `fetch()` and `XMLHttpRequest`

## Route Ordering

The email GET endpoint was added **before** the ID endpoint to ensure proper matching:

```javascript
// 1. Email endpoint (specific path)
if (path.startsWith("/api/participants/email/") && req.method === "GET") { ... }

// 2. ID endpoint (generic path, excludes "email")
if (path.startsWith("/api/participants/") && req.method === "GET" && !path.includes("email")) { ... }
```

This prevents `/api/participants/email/user@example.com` from being interpreted as `/api/participants/:id` with ID = "email".

## Implementation Details

### File Modified
- `badge/server.js` - Added GET endpoint handler

### Service Rebuilt
```bash
docker compose up -d --build badge
```

### Query Features
- **Case-insensitive**: `LOWER(email) = LOWER(?)` matches regardless of case
- **URL decoding**: `decodeURIComponent()` handles encoded characters
- **Error handling**: Returns 400 for missing email, 404 for not found

## Error Responses

### 400 Bad Request (Missing Email)
```json
{
  "error": "Email is required"
}
```

### 404 Not Found (Participant Not Found)
```json
{
  "error": "Participant not found",
  "email": "nonexistent@example.com"
}
```

### 500 Internal Server Error (Database Failure)
```json
{
  "error": "Database query failed",
  "details": "SQLite error details..."
}
```

## Migration Guide

### For Frontend Developers

**Before (POST):**
```javascript
const response = await fetch('http://localhost:13003/api/participants/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});
```

**After (GET - Recommended):**
```javascript
const email = 'user@example.com';
const response = await fetch(`http://localhost:13003/api/participants/email/${encodeURIComponent(email)}`);
```

### For API Consumers

Both methods work! Migrate at your convenience:
- **New code**: Use GET with URL parameter
- **Existing code**: Continue using POST (no changes needed)

## Related Documentation

- Badge service routes: `badge/server.js` lines 74-130
- API documentation: `README.md`
- Caddy proxy config: `Caddyfile`

---

## Summary

✅ **Issue Resolved**

Badge service now supports GET requests with email in URL path:
- `GET /api/participants/email/:email` - New, recommended
- `POST /api/participants/email` - Legacy, still supported

Both direct access (port 13003) and Caddy proxy (port 13000) tested and working.

---

**Fixed by**: Copilot  
**Date**: October 17, 2025  
**Service**: Badge (13003)  
**Files Modified**: `badge/server.js`  
**Testing**: All endpoints verified through direct and proxy access
