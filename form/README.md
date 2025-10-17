# Inscription Form App

## Description

Application d'inscription pour les événements Go Talent, construite avec Vue.js 3, Vuetify, TypeScript pour le frontend et Deno avec Hono pour le backend.

## Fonctionnalités

- ✅ Formulaire multi-étapes avec validation
- ✅ Sauvegarde automatique en localStorage
- ✅ Compte à rebours pour la date limite d'inscription
- ✅ Interface responsive avec Vuetify
- ✅ Mode sombre/clair
- ✅ Backend API avec Deno et Hono
- ✅ Base de données SQLite
- ✅ Docker et Docker Compose pour le déploiement
- ✅ Reverse proxy avec Caddy
- ✅ Interface d'administration avec Adminer

## Technologies utilisées

### Frontend

- Vue.js 3
- Vuetify 3
- TypeScript
- Vite
- Pinia (state management)

### Backend

- Deno
- Hono (framework web)
- SQLite
- TypeScript

### DevOps

- Docker
- Docker Compose
- Caddy (reverse proxy)
- Nginx (serveur web)
- Adminer (interface base de données)

## Structure du projet

```
inscription_form/
├── src/                    # Code source frontend
│   ├── components/         # Composants Vue
│   ├── stores/            # Stores Pinia
│   ├── types/             # Types TypeScript
│   └── main.ts           # Point d'entrée
├── server/                # Code source backend
│   ├── server.ts         # Serveur Hono
│   ├── migrate.ts        # Migrations base de données
│   └── deno.json         # Configuration Deno
├── docker-compose.yml    # Configuration Docker Compose
├── Dockerfile           # Dockerfile frontend
└── package.json         # Dépendances frontend
```

## Installation et démarrage

### Prérequis

- Node.js 18+
- Deno 1.42+
- Docker et Docker Compose (pour le déploiement)

### Développement local

1. **Installation des dépendances frontend :**

```bash
npm install
```

2. **Démarrage du backend :**

```bash
cd server
deno task migrate  # Créer la base de données
deno task dev      # Démarrer le serveur en mode développement
```

3. **Démarrage du frontend :**

```bash
npm run dev
```

L'application sera accessible sur <http://localhost:5173>

### Déploiement avec Docker

1. **Construction et démarrage des services :**

```bash
docker-compose up --build
```

2. **Services disponibles :**

- Frontend: <http://localhost> (via Caddy)
- Backend API: <http://localhost/api>
- Adminer (DB): <http://localhost:8080>

## Structure du formulaire

### Étape 1: Informations personnelles

- Nom* (requis)
- Post-nom
- Prénom
- Sexe* (requis)
- Date de naissance
- Email* (requis)
- Téléphone
- Adresse

### Étape 2: Éducation

- Diplôme* (requis)
- Établissement* (requis)
- Année d'obtention* (requis)

### Étape 3: Expérience professionnelle

- Poste* (requis)
- Entreprise
- Années d'expérience
- Description du poste

### Étape 4: À propos de l'événement

- Comment avez-vous entendu parler de l'événement?* (requis)
- Qu'attendez-vous de cet événement?* (requis)
- Commentaires supplémentaires
- Consentement* (requis)
- Informations futures

## API Endpoints

- `GET /api/health` - Vérification du statut
- `GET /api/inscriptions` - Liste des inscriptions
- `POST /api/inscriptions` - Créer une inscription
- `GET /api/inscriptions/:id` - Récupérer une inscription
- `GET /api/statistics` - Statistiques

## Sécurité

- Validation côté client et serveur
- Protection CORS
- Headers de sécurité
- Validation des emails uniques
- Sanitisation des données

## Accessibilité

- Support ARIA
- Navigation au clavier
- Contrastes conformes WCAG
- Textes alternatifs pour les images
- Structure sémantique

## Licence

Ce projet est sous licence privée pour Go Talent.
