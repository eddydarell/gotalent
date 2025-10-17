# GoTalent Platform Migration Plan

## Overview
Unifying four separate services into a cohesive microservices architecture with shared database, consistent design, and modern tooling.

## Current State

### Services
1. **host_app** (Scanner) - QR code scanner for checking participant registration
   - Stack: Node.js + Express + Vite
   - Database: SQLite (participants.db)
   - Ports: 3002 (API), 3003 (Frontend)

2. **participant_app** (Badge) - Generates participant badges with QR codes
   - Stack: Node.js + Express + Vite + Tailwind
   - Database: SQLite (participants.db) - shares schema with scanner
   - Port: 3000

3. **inscription_form** (Form) - Registration form for participants
   - Stack: Deno + Hono + Vue 3 + Vuetify
   - Database: SQLite (inscriptions.db) - separate database
   - Ports: 8000 (Backend), 3000 (Frontend)

4. **landing** - Event landing page
   - Stack: Static HTML
   - No backend

### Database Schemas

#### participants table (host_app & participant_app)
```sql
CREATE TABLE participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
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
```

#### inscriptions table (inscription_form)
```sql
CREATE TABLE inscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    post_nom TEXT,
    prenom TEXT,
    sexe TEXT NOT NULL,
    date_naissance TEXT,
    email TEXT NOT NULL UNIQUE,
    telephone TEXT,
    adresse TEXT,
    diplome TEXT NOT NULL,
    etablissement TEXT NOT NULL,
    annee_obtention INTEGER NOT NULL,
    poste TEXT NOT NULL,
    entreprise TEXT,
    annees_experience INTEGER,
    description_poste TEXT,
    comment_entendu TEXT NOT NULL,
    attentes TEXT NOT NULL,
    commentaires_supplementaires TEXT,
    accepte_termes BOOLEAN NOT NULL DEFAULT FALSE,
    accepte_utilisation_donnees BOOLEAN NOT NULL DEFAULT FALSE,
    souhaite_informations_futures BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Design Tokens (from landing page)

#### Colors
- **Background**: `#1c1c1c` (Dark charcoal)
- **Primary Gold**: `#daa520` (Goldenrod)
- **Text**: `#f3e5ab` (Wheat/Cream)
- **Secondary Browns**: `#8b7355`, `#9b8365`, `#ab9375`, `#7b6345`, `#6b5335`
- **Dark Brown**: `#2c1810`

#### Typography
- **Primary Font**: Inter (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Monospace**: JetBrains Mono, Fira Code, Monaco, Cascadia Code

#### Font Weights
- Light: 300
- Regular: 400-500
- Bold: 600-700
- Extra Bold: 800-900

## Target Architecture

### Directory Structure
```
gotalent/
├── compose.yml                 # Main orchestration
├── Caddyfile                   # Reverse proxy config
├── README.md                   # Project documentation
├── data/                       # Shared database volume
│   └── gotalent.db            # Unified SQLite database
├── landing/                    # Static landing page (port 3001)
├── form/                       # Registration form (port 3002)
├── badge/                      # Badge generator (port 3003)
└── scanner/                    # QR scanner (port 3004)
```

### Service Ports
- Landing: 3001
- Form: 3002
- Badge: 3003
- Scanner: 3004
- Adminer: 8080
- Caddy: 80 (HTTP), 443 (HTTPS)

### Unified Database Schema
```sql
-- Merged and enhanced schema
CREATE TABLE participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Personal Information
    nom TEXT NOT NULL,
    post_nom TEXT,
    prenom TEXT,
    name TEXT,  -- Computed: nom + prenom or email prefix
    sexe TEXT,
    gender TEXT,  -- Alias for sexe
    date_naissance TEXT,
    
    -- Contact Information
    email TEXT UNIQUE NOT NULL,
    telephone TEXT,
    contact_number TEXT,  -- Alias for telephone
    adresse TEXT,
    
    -- Education
    diplome TEXT,
    etablissement TEXT,
    annee_obtention INTEGER,
    
    -- Professional Experience
    poste TEXT,
    entreprise TEXT,
    annees_experience INTEGER,
    description_poste TEXT,
    expertise_domain TEXT,
    
    -- Event Related
    how_heard TEXT,
    comment_entendu TEXT,  -- JSON array
    objectives TEXT,
    attentes TEXT,  -- JSON array
    expectations TEXT,
    commentaires_supplementaires TEXT,
    drink_preference TEXT,
    
    -- Consent & Terms
    accepte_termes BOOLEAN DEFAULT FALSE,
    accepte_utilisation_donnees BOOLEAN DEFAULT FALSE,
    souhaite_informations_futures BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    timestamp TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paiement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('paid', 'unpaid', 'pending')),
    montant REAL NOT NULL,
    date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_email ON participants(email);
CREATE INDEX idx_created_at ON participants(created_at);
CREATE INDEX idx_paiement_participant_id ON paiement(participant_id);
CREATE INDEX idx_paiement_status ON paiement(status);
```

## Implementation Steps

### Phase 1: Directory Restructuring
1. Rename `host_app` → `scanner`
2. Rename `participant_app` → `badge`
3. Rename `inscription_form` → `form`
4. Create root `data/` directory

### Phase 2: Database Unification
1. Create unified schema in `data/gotalent.db`
2. Write migration script to merge existing data
3. Update all services to use shared database path

### Phase 3: Tooling Migration (Bun)
1. Convert scanner to Bun
2. Convert badge to Bun
3. Convert form from Deno to Bun
4. Update all Dockerfiles to use `oven/bun` base image

### Phase 4: Design Unification
1. Create shared CSS variables/design tokens
2. Update scanner UI
3. Update badge UI
4. Update form Vuetify theme

### Phase 5: Infrastructure
1. Create root `compose.yml`
2. Create `Caddyfile` for routing
3. Add Adminer service
4. Configure shared volumes

### Phase 6: Documentation & Testing
1. Create comprehensive README
2. Test all services
3. Verify database sharing
4. Test Caddy routing

## Caddy Routes
```
localhost:80 {
    route / {
        reverse_proxy landing:3001
    }
    
    route /form* {
        reverse_proxy form:3002
    }
    
    route /badge* {
        reverse_proxy badge:3003
    }
    
    route /scanner* {
        reverse_proxy scanner:3004
    }
    
    route /db* {
        reverse_proxy adminer:8080
    }
}
```

## Bun Migration Notes

### Package.json changes
- Remove `"type": "module"` (Bun handles ESM/CJS automatically)
- Update scripts to use `bun` instead of `node`/`deno`
- Replace dependencies with Bun-compatible versions

### Server code
- Replace `require()` with `import` statements
- Use Bun's built-in SQLite: `import { Database } from "bun:sqlite"`
- Use Bun's HTTP server or keep Express (Bun supports both)

### Dockerfile
```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build  # if needed

EXPOSE 3000
CMD ["bun", "run", "server.js"]
```
