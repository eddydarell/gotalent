#!/usr/bin/env bun
/**
 * Migration script to create unified database and migrate existing data
 * Usage: bun run migrate-db.js
 */

import { Database } from "bun:sqlite";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const rootDir = import.meta.dir;
const dataDir = join(rootDir, "data");
const newDbPath = join(dataDir, "gotalent.db");

// Paths to old databases
const scannerDbPath = join(rootDir, "scanner", "data", "participants.db");
const badgeDbPath = join(rootDir, "badge", "participants.db");
const formDbPath = join(rootDir, "form", "server", "inscriptions.db");

console.log("🚀 Starting database migration...\n");

// Create new unified database
const db = new Database(newDbPath);

// Read and execute schema
const schemaSQL = readFileSync(join(dataDir, "init-db.sql"), "utf-8");
db.exec(schemaSQL);
console.log("✅ Created unified database schema");

// Migrate data from scanner/badge participants database
if (existsSync(scannerDbPath)) {
    console.log("\n📦 Migrating data from scanner/badge database...");
    
    const oldDb = new Database(scannerDbPath, { readonly: true });
    const participants = oldDb.query("SELECT * FROM participants").all();
    
    const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO participants (
            name, email, contact_number, telephone, how_heard, expertise_domain,
            gender, sexe, objectives, expectations, drink_preference, timestamp, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let migrated = 0;
    for (const p of participants) {
        try {
            insertStmt.run(
                p.name,
                p.email,
                p.contact_number,
                p.contact_number, // Also set telephone
                p.how_heard,
                p.expertise_domain,
                p.gender,
                p.gender, // Also set sexe
                p.objectives,
                p.expectations,
                p.drink_preference,
                p.timestamp,
                p.created_at || new Date().toISOString()
            );
            migrated++;
        } catch (err) {
            console.log(`⚠️  Skipped duplicate: ${p.email}`);
        }
    }
    
    oldDb.close();
    console.log(`✅ Migrated ${migrated} participants from scanner/badge`);
}

// Migrate data from form inscriptions database
if (existsSync(formDbPath)) {
    console.log("\n📦 Migrating data from form database...");
    
    const oldDb = new Database(formDbPath, { readonly: true });
    const inscriptions = oldDb.query("SELECT * FROM inscriptions").all();
    
    const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO participants (
            nom, post_nom, prenom, name, sexe, gender, date_naissance,
            email, telephone, contact_number, adresse,
            diplome, etablissement, annee_obtention,
            poste, entreprise, annees_experience, description_poste,
            comment_entendu, attentes, commentaires_supplementaires,
            accepte_termes, accepte_utilisation_donnees, souhaite_informations_futures,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let migrated = 0;
    for (const i of inscriptions) {
        try {
            // Compute full name
            const fullName = [i.nom, i.post_nom, i.prenom].filter(Boolean).join(" ");
            
            insertStmt.run(
                i.nom,
                i.post_nom,
                i.prenom,
                fullName,
                i.sexe,
                i.sexe, // Also set gender
                i.date_naissance,
                i.email,
                i.telephone,
                i.telephone, // Also set contact_number
                i.adresse,
                i.diplome,
                i.etablissement,
                i.annee_obtention,
                i.poste,
                i.entreprise,
                i.annees_experience,
                i.description_poste,
                i.comment_entendu,
                i.attentes,
                i.commentaires_supplementaires,
                i.accepte_termes,
                i.accepte_utilisation_donnees,
                i.souhaite_informations_futures,
                i.created_at,
                i.updated_at
            );
            migrated++;
        } catch (err) {
            console.log(`⚠️  Skipped duplicate: ${i.email}`);
        }
    }
    
    // Migrate paiement data if table exists
    try {
        const paiements = oldDb.query("SELECT * FROM paiement").all();
        const paiementStmt = db.prepare(`
            INSERT INTO paiement (participant_id, status, montant, date_paiement, created_at, updated_at)
            SELECT id, ?, ?, ?, ?, ? FROM participants WHERE email = ?
        `);
        
        for (const p of paiements) {
            // Get email from old inscription_id
            const inscription = inscriptions.find(i => i.id === p.inscription_id);
            if (inscription) {
                try {
                    paiementStmt.run(
                        p.status,
                        p.montant,
                        p.date_paiement,
                        p.created_at,
                        p.updated_at,
                        inscription.email
                    );
                } catch (err) {
                    console.log(`⚠️  Could not migrate payment for: ${inscription.email}`);
                }
            }
        }
        console.log(`✅ Migrated payment records`);
    } catch (err) {
        console.log("ℹ️  No payment data to migrate");
    }
    
    oldDb.close();
    console.log(`✅ Migrated ${migrated} participants from form`);
}

// Show statistics
const stats = db.query("SELECT COUNT(*) as count FROM participants").get();
const paiementStats = db.query("SELECT COUNT(*) as count FROM paiement").get();

console.log("\n📊 Migration Complete!");
console.log(`   Total participants: ${stats.count}`);
console.log(`   Total payment records: ${paiementStats.count}`);
console.log(`   Database location: ${newDbPath}\n`);

db.close();
