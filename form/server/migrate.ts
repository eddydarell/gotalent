import { Database } from "@db/sqlite";

const db = new Database("inscriptions.db");

// Create inscriptions table
db.exec(`
  CREATE TABLE IF NOT EXISTS inscriptions (
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
  )
`);

// Create paiement table
db.exec(`
  CREATE TABLE IF NOT EXISTS paiement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inscription_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('paid', 'unpaid')),
    montant REAL NOT NULL,
    date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inscription_id) REFERENCES inscriptions(id) ON DELETE CASCADE
  )
`);

// Create indexes for better performance
db.exec(`CREATE INDEX IF NOT EXISTS idx_email ON inscriptions(email)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_created_at ON inscriptions(created_at)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_paiement_inscription_id ON paiement(inscription_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_paiement_status ON paiement(status)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_paiement_date ON paiement(date_paiement)`);

console.log("Database migrated successfully!");

db.close();
