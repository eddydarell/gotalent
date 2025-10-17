#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('🗄️  Initializing SQLite database for Go Talent participants...');

// Initialize SQLite database
const db = new Database('participants.db');

// Create participants table
const createTableQuery = `
CREATE TABLE IF NOT EXISTS participants (
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
)`;

db.exec(createTableQuery);
console.log('✅ Created participants table');

// Create index for faster email lookups
db.exec('CREATE INDEX IF NOT EXISTS idx_email ON participants(email)');
console.log('✅ Created email index');

// Function to slugify keys for consistent mapping
function slugifyKey(key) {
    if (!key || typeof key !== 'string') return key;
    
    return key
        .toLowerCase()
        .normalize('NFD') // Decompose accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
        .replace(/[^a-z0-9\s]/g, ' ') // Replace special characters with spaces
        .replace(/\s+/g, '_') // Replace multiple spaces with single underscores
        .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
        .trim();
}

// Function to create a key mapping object for consistent data access
function createKeyMapping(participant) {
    const keyMap = {};
    
    // Define the expected database fields and their possible French variations
    const fieldMappings = {
        'how_heard': ['comment_avez_vous_entendu_parler_de_l_evenement_go_talent', 'how_heard'],
        'expertise_domain': ['veuillez_selectionner_votre_domaine_d_expertise', 'expertise_domain', 'expertise'],
        'gender': ['genre', 'gender'],
        'objectives': ['quel_s_objectif_s_avez_vous_en_participant', 'objectives'],
        'expectations': ['merci_de_preciser_ce_que_vous_attendez_de_cette_conference_contenu_contacts_suivi_etc', 'expectations'],
        'drink_preference': ['boisson', 'drink_preference', 'drink'],
        'timestamp': ['timestamp'],
        'email': ['email'],
        'contact_number': ['contact_number'],
        'nom_complet': ['nom_complet', 'nom_complet']
    };
    
    // Create slugified keys for all participant keys
    const slugifiedKeys = {};
    Object.keys(participant).forEach(originalKey => {
        const slugified = slugifyKey(originalKey);
        slugifiedKeys[slugified] = originalKey;
    });
    
    // Map database fields to actual participant keys
    Object.entries(fieldMappings).forEach(([dbField, possibleKeys]) => {
        for (const possibleKey of possibleKeys) {
            if (slugifiedKeys[possibleKey]) {
                keyMap[dbField] = slugifiedKeys[possibleKey];
                break;
            }
        }
    });
    
    return keyMap;
}

// Function to normalize phone numbers
function normalizePhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return null;
    }
    
    // Handle multiple phone numbers separated by / or other delimiters
    // Take only the first phone number
    let firstNumber = phoneNumber.split(/[/,;|]|\s+and\s+|\s+ou\s+/)[0].trim();
    
    // Remove all non-digit characters except +
    let cleaned = firstNumber.replace(/[^\d+]/g, '');
    
    // Handle Swedish numbers (+46)
    if (cleaned.startsWith('+46')) {
        return cleaned; // Keep Swedish numbers as is
    }
    
    // Remove + if present for other numbers
    cleaned = cleaned.replace(/\+/g, '');
    
    // Handle Congolese numbers
    if (cleaned.startsWith('243')) {
        return '+' + cleaned;
    } else if (cleaned.startsWith('0') && cleaned.length >= 9) {
        // Remove leading 0 and add +243
        return '+243' + cleaned.substring(1);
    } else if (cleaned.length >= 9 && !cleaned.startsWith('243')) {
        // Assume it's a Congolese number without country code
        return '+243' + cleaned;
    }
    
    return cleaned ? '+243' + cleaned : null;
}

// Function to extract name from participant data
function extractParticipantName(participant, keyMap) {
    // Try to get "Nom complet" field using the key mapping
    const nomCompletKey = keyMap['nom_complet'];
    if (nomCompletKey && participant[nomCompletKey] && participant[nomCompletKey].trim()) {
        return participant[nomCompletKey].trim();
    }
    
    // Fall back to email prefix if no full name
    const email = participant.Email;
    if (email && typeof email === 'string') {
        const emailPrefix = email.split('@')[0];
        return emailPrefix;
    }
    
    return 'Unknown';
}
function normalizeEmail(email) {
    if (!email || typeof email !== 'string') {
        return null;
    }
    
    // Trim whitespace and convert to lowercase
    let cleaned = email.trim().toLowerCase();
    
    // Remove leading www. if it exists
    if (cleaned.startsWith('www.')) {
        cleaned = cleaned.substring(4);
    }
    
    return cleaned;
}

// Migration function to import data from JSON
function migrateFromJSON() {
    const jsonPath = path.join(__dirname, 'data', 'participants.json');
    
    if (!fs.existsSync(jsonPath)) {
        console.log('❌ No participants.json found at:', jsonPath);
        return;
    }

    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`📄 Found ${jsonData.length} participants in JSON file`);
        
        // Check for duplicates and prepare clean data
        const emailsSeen = new Set();
        const cleanData = [];
        let duplicatesSkipped = 0;
        let invalidEntriesSkipped = 0;
        const skippedEntries = [];
        
        for (let i = 0; i < jsonData.length; i++) {
            const participant = jsonData[i];
            const email = normalizeEmail(participant.Email);
            
            // Skip entries with invalid or missing email
            if (!email) {
                invalidEntriesSkipped++;
                const skippedEntry = {
                    index: i + 1,
                    reason: 'Missing or invalid email',
                    data: participant
                };
                skippedEntries.push(skippedEntry);
                console.log(`⚠️  Skipping entry ${i + 1}: Missing or invalid email - ${JSON.stringify(participant.Email)}`);
                continue;
            }
            
            // Skip duplicate emails
            if (emailsSeen.has(email)) {
                duplicatesSkipped++;
                const skippedEntry = {
                    index: i + 1,
                    reason: 'Duplicate email',
                    email: email,
                    data: participant
                };
                skippedEntries.push(skippedEntry);
                console.log(`⚠️  Skipping entry ${i + 1}: Duplicate email - ${email}`);
                continue;
            }
            
            emailsSeen.add(email);
            cleanData.push(participant);
        }
        
        console.log(`📊 Processing results:`);
        console.log(`   Total entries processed: ${jsonData.length}`);
        console.log(`   Valid unique participants: ${cleanData.length}`);
        console.log(`   Duplicate emails skipped: ${duplicatesSkipped}`);
        console.log(`   Invalid entries skipped: ${invalidEntriesSkipped}`);
        console.log(`   Total skipped: ${skippedEntries.length}`);
        
        if (skippedEntries.length > 0) {
            console.log(`\n📋 Detailed list of all skipped entries:`);
            skippedEntries.forEach((entry, index) => {
                console.log(`   ${index + 1}. Entry #${entry.index}: ${entry.reason}`);
                if (entry.email) {
                    console.log(`      Email: ${entry.email}`);
                }
                console.log(`      Original data: ${JSON.stringify(entry.data, null, 2)}`);
                console.log('   ---');
            });
        }
        
        // Check if data already exists
        const count = db.prepare('SELECT COUNT(*) as count FROM participants').get();
        if (count.count > 0) {
            console.log(`⚠️  Database already contains ${count.count} participants`);
            console.log('   To re-import, delete participants.db and run this script again');
            return;
        }

        const insertStmt = db.prepare(`
            INSERT INTO participants (
                name, email, contact_number, how_heard, expertise_domain, 
                gender, objectives, expectations, drink_preference, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const insertMany = db.transaction((participants) => {
            for (const participant of participants) {
                // Create key mapping for this participant
                const keyMap = createKeyMapping(participant);
                
                // Extract participant name using key mapping
                const participantName = extractParticipantName(participant, keyMap);
                
                // Normalize phone number
                const normalizedPhone = normalizePhoneNumber(participant["Contact Number"]);
                
                // Normalize email address
                const normalizedEmail = normalizeEmail(participant.Email);
                
                // Use key mapping to get values with proper fallbacks
                const howHeard = keyMap['how_heard'] ? participant[keyMap['how_heard']] : null;
                const expertiseDomain = keyMap['expertise_domain'] ? participant[keyMap['expertise_domain']] : null;
                const gender = keyMap['gender'] ? participant[keyMap['gender']] : null;
                const objectives = keyMap['objectives'] ? participant[keyMap['objectives']] : null;
                const expectations = keyMap['expectations'] ? participant[keyMap['expectations']] : null;
                const drinkPreference = keyMap['drink_preference'] ? participant[keyMap['drink_preference']] : null;
                const timestamp = keyMap['timestamp'] ? participant[keyMap['timestamp']] : new Date().toISOString();
                
                insertStmt.run(
                    participantName,
                    normalizedEmail,
                    normalizedPhone,
                    howHeard,
                    expertiseDomain,
                    gender,
                    objectives,
                    expectations,
                    drinkPreference,
                    timestamp
                );
            }
        });

        insertMany(cleanData);
        console.log(`✅ Successfully migrated ${cleanData.length} participants to SQLite database`);
        
        // Show some stats
        const stats = db.prepare(`
            SELECT 
                COUNT(*) as total,
                COUNT(DISTINCT expertise_domain) as unique_domains,
                COUNT(DISTINCT gender) as unique_genders,
                COUNT(CASE WHEN contact_number IS NOT NULL THEN 1 END) as with_phone
            FROM participants
        `).get();
        
        console.log(`📊 Database stats:`);
        console.log(`   Total participants: ${stats.total}`);
        console.log(`   Participants with phone numbers: ${stats.with_phone}`);
        console.log(`   Unique expertise domains: ${stats.unique_domains}`);
        console.log(`   Unique genders: ${stats.unique_genders}`);
        
    } catch (error) {
        console.error('❌ Error migrating data:', error);
    }
}

// Run migration
migrateFromJSON();

// Close database
db.close();
console.log('🎉 Database initialization complete!');
