# Go Talent Scanner - SQLite Version

A Progressive Web App (PWA) for scanning QR codes to check event registration status using SQLite database.

## Features

- QR Code scanning using device camera
- Manual email/phone number input
- Registration verification against SQLite database
- Progressive Web App with offline capabilities
- Audio feedback for successful scans
- Responsive design optimized for mobile devices

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Prepare the database:**
   - Ensure your SQLite database is located at `data/participants.db`
   - The database should have a `participants` table with columns for participant information
   - Use the inspection script to check your database structure:
     ```bash
     node inspect-db.js
     ```

3. **Expected Database Schema:**
   The application expects a table with these columns (adjust field names in server.js if needed):
   - `name` or `full_name` - Participant's name
   - `email` - Email address
   - `phone` - Phone number

### Running the Application

#### Development Mode (with auto-reload):
```bash
# Start both the API server and Vite dev server
npm run dev:full
```

This will start:
- API server on `http://localhost:3002`
- Vite dev server on `http://localhost:3003`

#### Production Mode:
```bash
# Build the frontend
npm run build

# Start the API server
npm run server

# Serve the built frontend (in another terminal)
npm run preview
```

### API Endpoints

The backend server provides these endpoints:

- `GET /api/participants` - Get all participants
- `GET /api/check-registration?email=...&phone=...` - Check registration status
- `GET /api/health` - Health check

### Database Structure

Run the inspection script to see your current database structure:
```bash
node inspect-db.js
```

### Customization

#### Modifying Database Schema
If your database has different column names, update the server.js file:

```javascript
// In the /api/check-registration endpoint
// Modify the SQL query to match your column names
const query = 'SELECT * FROM participants WHERE LOWER(your_email_column) = LOWER(?) OR your_phone_column = ?';
```

#### Adding More Fields
To display additional participant information:

1. Update the API response in `server.js`
2. Modify the `showResult` method in `src/main.js` to display the new fields

### Troubleshooting

1. **Database Connection Issues:**
   - Ensure `data/participants.db` exists and is readable
   - Check the database path in `server.js`

2. **API Connection Issues:**
   - Make sure the server is running on port 3001
   - Check for CORS issues if accessing from different domains

3. **SQLite Issues:**
   - Install SQLite3 native dependencies: `npm install sqlite3`
   - On some systems, you might need to rebuild: `npm rebuild sqlite3`

### Phone Number Formats

The application supports these DR Congo phone number formats:
- `+243XXXXXXXXX` (international format)
- `0XXXXXXXXX` (local format with leading 0)
- `XXXXXXXXX` (9 digits without prefix)

### Development Notes

- The frontend runs on Vite dev server (port 5173)
- The API server runs on Express (port 3001)
- SQLite database is accessed server-side only for security
- CORS is enabled for development

### Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

3. Deploy both the static files and the `server.js` API to your hosting platform

### Security Considerations

- The SQLite database is only accessible server-side
- Consider adding authentication for production use
- Validate and sanitize all input data
- Use HTTPS in production
