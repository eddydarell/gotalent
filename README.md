# GoTalent Platform - Unified Microservices Architecture

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A comprehensive event management platform for Go Talent events, featuring registration, badge generation, and QR code scanning services unified under a single architecture.

## 🏗️ Architecture

The platform consists of four microservices orchestrated through Docker Compose with Caddy as a reverse proxy:

```
┌─────────────────────────────────────────────────────────┐
│                      Caddy Proxy                         │
│                    (Port 80/443)                         │
└───────────────┬──────────────┬──────────────┬───────────┘
                │              │              │
    ┌───────────▼──┐  ┌───────▼──────┐  ┌───▼──────────┐
    │   Landing    │  │     Form      │  │    Badge     │
    │  (Port 3001) │  │  (Port 3002)  │  │ (Port 3003)  │
    └──────────────┘  └───────────────┘  └──────────────┘
                               │
                      ┌────────▼─────────┐
                      │     Scanner      │
                      │   (Port 3004)    │
                      └──────────────────┘
                               │
                      ┌────────▼─────────┐
                      │   SQLite DB      │
                      │  (Shared Volume) │
                      └──────────────────┘
```

## 🚀 Services

### 1. Landing Page (Port 3001)

- **Purpose**: Event information and navigation hub
- **Tech**: Static HTML/CSS/JS
- **Access**: `/` (root path)

### 2. Registration Form (Port 3002)

- **Purpose**: Participant registration interface
- **Tech**: Vue 3 + Vuetify + Bun
- **Access**: `/form`
- **API**: `/api/inscriptions`

### 3. Badge Generator (Port 3003)

- **Purpose**: Generate participant badges with QR codes
- **Tech**: Vanilla JS + Vite + Bun
- **Access**: `/badge`
- **API**: `/api/participants`

### 4. QR Scanner (Port 3004)

- **Purpose**: Scan and validate participant QR codes
- **Tech**: Vanilla JS + html5-qrcode + Bun
- **Access**: `/scanner`
- **API**: `/api/check-registration`

### 5. Database Admin (Port 8080)

- **Purpose**: Database management interface
- **Tech**: Adminer
- **Access**: `/db`

## 🎨 Design System

All services share a unified design language:

**Color Palette:**

- Background: `#1c1c1c` (Dark charcoal)
- Primary: `#daa520` (Goldenrod)
- Text: `#f3e5ab` (Wheat/Cream)
- Accent: Brown variants (`#8b7355`, `#9b8365`, etc.)

**Typography:**

- Primary: Inter (with system fallbacks)
- Monospace: JetBrains Mono, Fira Code

**Design tokens** are centralized in `design-tokens.js` at the root.

## 💾 Database

### Unified Schema

All services share a single SQLite database (`data/gotalent.db`) with the following structure:

#### Participants Table

```sql
CREATE TABLE participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Personal info
    nom TEXT, post_nom TEXT, prenom TEXT, name TEXT,
    sexe TEXT, gender TEXT, date_naissance TEXT,
    -- Contact
    email TEXT UNIQUE NOT NULL,
    telephone TEXT, contact_number TEXT, adresse TEXT,
    -- Education
    diplome TEXT, etablissement TEXT, annee_obtention INTEGER,
    -- Professional
    poste TEXT, entreprise TEXT, annees_experience INTEGER,
    description_poste TEXT, expertise_domain TEXT,
    -- Event-related
    how_heard TEXT, comment_entendu TEXT,
    objectives TEXT, attentes TEXT, expectations TEXT,
    commentaires_supplementaires TEXT, drink_preference TEXT,
    -- Consent
    accepte_termes BOOLEAN, accepte_utilisation_donnees BOOLEAN,
    souhaite_informations_futures BOOLEAN,
    -- Metadata
    timestamp TEXT, created_at DATETIME, updated_at DATETIME
);
```

#### Payment Table

```sql
CREATE TABLE paiement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('paid', 'unpaid', 'pending')),
    montant REAL NOT NULL,
    date_paiement DATETIME,
    created_at DATETIME, updated_at DATETIME,
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);
```

## 🛠️ Setup & Installation

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- [Docker](https://www.docker.com/) & Docker Compose
- [Caddy](https://caddyserver.com/) (included in Docker setup)

### Quick Start

1. **Clone the repository**

```bash
git clone <repository-url>
cd gotalent
```

2. **Initialize the database**

```bash
bun run migrate-db.js
```

This will:

- Create the unified database at `data/gotalent.db`
- Migrate existing data from old databases
- Set up proper schema with indexes

3. **Start all services**

```bash
docker-compose up --build
```

Or run services individually:

```bash
# Landing (uses Python's built-in server for development)
cd landing && python3 -m http.server 3001

# Form
cd form && bun install && bun run dev

# Badge
cd badge && bun install && bun run dev:full

# Scanner
cd scanner && bun install && bun run dev:full
```

### Development Mode

Each service can be run independently:

```bash
# Install dependencies for a service
cd <service-name>
bun install

# Run in development mode
bun run dev        # Frontend only
bun run server     # Backend only
bun run dev:full   # Full stack (both)
```

## 📡 API Endpoints

### Registration Form (`/api/inscriptions`)

- `GET /api/inscriptions` - List all registrations
- `POST /api/inscriptions` - Create new registration
- `GET /api/inscriptions/:id` - Get registration by ID
- `GET /api/statistics` - Get registration statistics

### Badge Service (`/api/participants`)

- `GET /api/participants/:id` - Get participant by ID
- `GET /api/participants/email/:email` - Get by email
- `GET /api/participants/search?q=...` - Search participants
- `GET /api/participants/stats/count` - Total count

### Scanner Service (`/api/check-registration`)

- `GET /api/check-registration?email=...&phone=...` - Verify registration
- `GET /api/participants` - List all participants

### Health Checks

All services expose: `GET /api/health`

## 🐳 Docker Deployment

### Build and Run

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Service

```bash
# Build
docker build -t gotalent-<service> ./<service>

# Run
docker run -p <port>:<port> -v $(pwd)/data:/data gotalent-<service>
```

## 🔄 Database Migration

If you have existing databases from the old structure:

```bash
bun run migrate-db.js
```

This script will:

1. Create the new unified schema
2. Import data from `scanner/data/participants.db`
3. Import data from `badge/participants.db`
4. Import data from `form/server/inscriptions.db`
5. Merge duplicates (by email)
6. Preserve payment records

## 🌐 Routing (Caddy)

The Caddy reverse proxy routes requests as follows:

| Path | Service | Port |
|------|---------|------|
| `/` | Landing | 3001 |
| `/form*` | Form | 3002 |
| `/badge*` | Badge | 3003 |
| `/scanner*` | Scanner | 3004 |
| `/db*` | Adminer | 8080 |
| `/api/inscriptions*` | Form | 3002 |
| `/api/participants*` | Badge/Scanner | 3003/3004 (round-robin) |

## 📁 Project Structure

```
gotalent/
├── compose.yml              # Docker Compose orchestration
├── Caddyfile                # Reverse proxy configuration
├── migrate-db.js            # Database migration script
├── design-tokens.js         # Shared design system
├── data/                    # Shared database volume
│   ├── gotalent.db          # Unified SQLite database
│   └── init-db.sql          # Database schema
├── landing/                 # Landing page service
│   └── index.html
├── form/                    # Registration form service
│   ├── src/                 # Vue 3 frontend
│   ├── server/              # Bun backend
│   ├── Dockerfile
│   └── package.json
├── badge/                   # Badge generator service
│   ├── src/                 # Vanilla JS frontend
│   ├── server.js            # Bun backend
│   ├── Dockerfile
│   └── package.json
└── scanner/                 # QR scanner service
    ├── src/                 # Vanilla JS frontend
    ├── server.js            # Bun backend
    ├── Dockerfile
    └── package.json
```

## 🧪 Testing

```bash
# Test database connection
bun run migrate-db.js

# Test individual service
cd <service>
bun run build
bun run server

# Test API endpoints
curl http://localhost:3002/api/health
curl http://localhost:3003/api/health
curl http://localhost:3004/api/health
```

## 🔧 Configuration

### Environment Variables

Each service supports:

- `PORT` - Service port (default varies)
- `DATABASE_PATH` - Path to SQLite database (default: `/data/gotalent.db`)
- `NODE_ENV` - Environment mode (`development` | `production`)

### Docker Compose Override

Create `compose.override.yml` for local customizations:

```yaml
version: '3.8'
services:
  form:
    environment:
      - DEBUG=true
    ports:
      - "3002:3002"
```

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributors

Go Talent Team

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- UI components from [Vuetify](https://vuetifyjs.com)
- QR scanning via [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- Reverse proxy by [Caddy](https://caddyserver.com)

---

**Need help?** Open an issue or check the individual service READMEs for more details.
