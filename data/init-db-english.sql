-- GoTalent Unified Database Schema (English)
-- All column names standardized to English with no duplicates

-- Main participants table with unified English column names
CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Personal Information
    first_name TEXT,           -- was: prenom
    last_name TEXT,            -- was: nom
    middle_name TEXT,          -- was: post_nom
    full_name TEXT,            -- was: name (computed from first/last/middle)
    gender TEXT,               -- was: sexe/gender (merged)
    date_of_birth TEXT,        -- was: date_naissance
    
    -- Contact Information
    email TEXT UNIQUE NOT NULL,
    phone TEXT,                -- was: telephone/contact_number (merged)
    address TEXT,              -- was: adresse
    
    -- Education
    degree TEXT,               -- was: diplome
    institution TEXT,          -- was: etablissement
    graduation_year INTEGER,   -- was: annee_obtention
    
    -- Professional Experience
    position TEXT,             -- was: poste
    company TEXT,              -- was: entreprise
    years_of_experience INTEGER, -- was: annees_experience
    position_description TEXT, -- was: description_poste
    expertise_domain TEXT,     -- kept as is
    
    -- Event Related
    how_heard TEXT,            -- was: comment_entendu (JSON array string)
    expectations TEXT,         -- was: attentes/objectives (JSON array string)
    additional_comments TEXT,  -- was: commentaires_supplementaires
    drink_preference TEXT,     -- kept as is
    
    -- Consent & Terms
    terms_accepted BOOLEAN DEFAULT FALSE,      -- was: accepte_termes
    data_usage_accepted BOOLEAN DEFAULT FALSE, -- was: accepte_utilisation_donnees
    future_info_accepted BOOLEAN DEFAULT FALSE, -- was: souhaite_informations_futures
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payment tracking table
CREATE TABLE IF NOT EXISTS payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('paid', 'unpaid', 'pending')) DEFAULT 'unpaid',
    amount REAL NOT NULL DEFAULT 0,         -- was: montant
    payment_date DATETIME,                  -- was: date_paiement
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at);
CREATE INDEX IF NOT EXISTS idx_participants_full_name ON participants(full_name);
CREATE INDEX IF NOT EXISTS idx_participants_last_name ON participants(last_name);
CREATE INDEX IF NOT EXISTS idx_payment_participant_id ON payment(participant_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment(status);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payment(payment_date);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_participant_timestamp 
AFTER UPDATE ON participants
BEGIN
    UPDATE participants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_payment_timestamp 
AFTER UPDATE ON payment
BEGIN
    UPDATE payment SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
