# GoTalent Platform - Port Configuration

All services now run on ports in the range **13000-13100**.

## Service Ports

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Caddy** | 13000 | <http://localhost:13000> | Main entry point - Reverse proxy |
| **Landing** | 13001 | <http://localhost:13001> | Landing page (direct access) |
| **Form** | 13002 | <http://localhost:13002> | Registration form (direct access) |
| **Badge** | 13003 | <http://localhost:13003> | Badge generator (direct access) |
| **Scanner** | 13004 | <http://localhost:13004> | QR Scanner (direct access) |
| **Adminer** | 13080 | <http://localhost:13080> | Database management interface |
| **HTTPS** | 13443 | <https://localhost:13443> | HTTPS access via Caddy |

## Recommended Access

**Via Caddy (Reverse Proxy)** - Use port 13000:

- Landing: <http://localhost:13000/>
- Form: <http://localhost:13000/form>
- Badge: <http://localhost:13000/badge>
- Scanner: <http://localhost:13000/scanner>
- Adminer: <http://localhost:13000/db>

**Direct Access** - Use individual ports:

- Each service can be accessed directly on its respective port for testing/debugging

## Internal Container Ports

Services communicate internally using their default ports:

- Landing: 80 (nginx)
- Form: 3002
- Badge: 3003
- Scanner: 3004
- Adminer: 8080

External ports (13000-13100) are mapped to these internal ports via Docker.
