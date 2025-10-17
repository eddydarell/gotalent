-- GoTalent Unified Database Schema
-- Merges participants (from scanner/badge) and inscriptions (from form)

-- Main participants table with all fields from both schemas
CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) VIRTUAL,
    gender TEXT CHECK(gender IN ('M', 'F', 'Autre')),
    date_of_birth DATE,
    
    -- Contact Information
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    
    -- Education
    degree TEXT,
    institution TEXT,
    graduation_year INTEGER,
    
    -- Professional Experience
    position TEXT,
    company TEXT,
    years_of_experience INTEGER,
    position_description TEXT,
    expertise_domain TEXT,
    
        
    -- Event Information
    how_heard TEXT, -- JSON: {source: 'social_media', details: ''}
    expectations TEXT, -- JSON array of expectations
    additional_comments TEXT,
    drink_preference TEXT,
    
    -- Consent & Terms
    terms_accepted BOOLEAN DEFAULT 0,
    data_usage_accepted BOOLEAN DEFAULT 0,
    future_info_accepted BOOLEAN DEFAULT 0,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payment table (for payment tracking)
CREATE TABLE IF NOT EXISTS payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_phone ON participants(phone);
CREATE INDEX IF NOT EXISTS idx_participants_last_name ON participants(last_name);
CREATE INDEX IF NOT EXISTS idx_participants_first_name ON participants(first_name);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_participant_id ON payment(participant_id);
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
