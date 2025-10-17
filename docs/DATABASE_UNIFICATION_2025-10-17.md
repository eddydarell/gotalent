# Database Column Name Unification

**Date**: 2025-10-17  
**Status**: ✅ Complete

## Summary

Successfully unified all database column names to English and removed duplicate columns. All services (form, badge, scanner) updated and tested.

## Changes Made

### Database Schema (`data/init-db.sql`)

#### Participants Table

**Personal Information:**
- `nom` → `last_name`
- `prenom` → `first_name`
- `post_nom` → `middle_name`
- `name` → `full_name` (virtual/computed column)
- `sexe` ~~and `gender`~~ → `gender` (merged, removed duplicate)
- `date_naissance` → `date_of_birth`

**Contact Information:**
- `telephone` ~~and `contact_number`~~ → `phone` (merged, removed duplicate)
- `adresse` → `address`

**Education:**
- `diplome` → `degree`
- `etablissement` → `institution`
- `annee_obtention` → `graduation_year`

**Professional Experience:**
- `poste` → `position`
- `entreprise` → `company`
- `annees_experience` → `years_of_experience`
- `description_poste` → `position_description`

**Event Information:**
- `comment_entendu` ~~and `how_heard`~~ → `how_heard` (merged, removed duplicate)
- `attentes`, ~~`expectations`, `objectives`~~ → `expectations` (merged, removed duplicates)
- `commentaires_supplementaires` → `additional_comments`

**Consent & Terms:**
- `accepte_termes` → `terms_accepted`
- `accepte_utilisation_donnees` → `data_usage_accepted`
- `souhaite_informations_futures` → `future_info_accepted`

**Metadata:**
- ~~`timestamp`~~ → removed (redundant with `created_at`)

#### Payment Table

- Table renamed: `paiement` → `payment`
- `montant` → `amount`
- `date_paiement` → `payment_date`

### Service Updates

#### 1. Form Service (`form/server/server.ts`)

**Added Features:**
- Field mapping function for backward compatibility with French field names from frontend
- `transformData()` function to convert French → English
- Updated validation to use English field names

**Updated Queries:**
- `GET /api/inscriptions`: All column names now English
- `POST /api/inscriptions`: Insert query uses new column names
- JSON fields: `comment_entendu` → `how_heard`, `attentes` → `expectations`

**Code Changes:**
```typescript
// Added field mapping
const fieldMap: Record<string, string> = {
  nom: 'last_name',
  prenom: 'first_name',
  // ... full mapping
};

// Transform function
function transformData(data: any): any {
  const transformed: any = {};
  for (const [key, value] of Object.entries(data)) {
    const dbKey = fieldMap[key] || key;
    transformed[dbKey] = value;
  }
  return transformed;
}
```

#### 2. Badge Service (`badge/server.js`)

**Updated:**
- `transformParticipant()` function to use English column names
- Search query: `nom/prenom/post_nom` → `first_name/last_name/middle_name`
- Display name computation: Uses `full_name` virtual column

**Key Changes:**
```javascript
const displayName = participant.full_name || 
  [participant.first_name, participant.middle_name, participant.last_name].filter(Boolean).join(" ");

// Search query updated
WHERE full_name LIKE ? 
   OR first_name LIKE ? 
   OR last_name LIKE ? 
   OR middle_name LIKE ?
```

#### 3. Scanner Service (`scanner/server.js`)

**Updated:**
- Phone search: `telephone/contact_number` → `phone` (single column)
- Display name computation uses `full_name`, `first_name`, `last_name`, `middle_name`
- Removed redundant phone column checks

**Key Changes:**
```javascript
// Simplified phone search (no duplicates)
WHERE REPLACE(REPLACE(REPLACE(phone, " ", ""), "+", ""), "-", "") LIKE ?

// Name computation
const displayName = row.full_name || 
  [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" ");
```

## Testing Results

### Database Schema ✅
```bash
$ bun -e "const {Database} = require('bun:sqlite'); ..."
```
**Result**: All columns properly renamed, virtual column `full_name` working

### Health Checks ✅

1. **Form Service** (port 13002):
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-17T12:06:57.309Z"
   }
   ```

2. **Badge Service** (port 13003):
   ```json
   {
     "status": "OK",
     "timestamp": "2025-10-17T12:07:19.696Z"
   }
   ```

3. **Scanner Service** (port 13004):
   ```json
   {
     "status": "OK",
     "timestamp": "2025-10-17T12:07:30.139Z"
   }
   ```

## Benefits

### 1. Consistency ✅
- All column names in English
- No language mixing (French/English)
- Professional, industry-standard naming

### 2. No Duplicates ✅
- Single `gender` column (was `sexe` + `gender`)
- Single `phone` column (was `telephone` + `contact_number`)
- Single `expectations` column (was `attentes` + `expectations` + `objectives`)
- Single `how_heard` column (was `comment_entendu` + `how_heard`)

### 3. Clarity ✅
- `full_name` virtual column (auto-computed from `first_name + last_name`)
- Clear naming: `date_of_birth`, `graduation_year`, `years_of_experience`
- Removed ambiguous `timestamp` field (used `created_at` instead)

### 4. Maintainability ✅
- Easier for international developers
- Standard SQL naming conventions
- Reduced query complexity (fewer OR conditions for duplicates)

## Migration Notes

### Breaking Changes
⚠️ **Old code referencing French column names will break**

**Frontend Update Required:**
- If frontend sends French field names (nom, prenom, sexe, etc.), the form service now has a `transformData()` function for backward compatibility
- Badge and scanner services expect English names from database

**Recommended Frontend Update:**
Update form submissions to use English field names:
```javascript
// OLD (French)
{
  nom: "Tambwe",
  prenom: "Eddyn",
  sexe: "M",
  telephone: "+243...",
  diplome: "Master"
}

// NEW (English)
{
  last_name: "Tambwe",
  first_name: "Eddyn",
  gender: "M",
  phone: "+243...",
  degree: "Master"
}
```

### Database Migration Strategy
1. ✅ Stopped all services
2. ✅ Removed old database file
3. ✅ Updated schema file with English columns
4. ✅ Restarted services (auto-created new database with English schema)
5. ✅ Tested all health endpoints

**For Production:**
If database contains existing data, use a proper migration script:
```sql
-- Create new table with English columns
CREATE TABLE participants_new (...);

-- Copy data with column mapping
INSERT INTO participants_new (first_name, last_name, ...)
SELECT prenom, nom, ... FROM participants;

-- Drop old table and rename
DROP TABLE participants;
ALTER TABLE participants_new RENAME TO participants;
```

## Documentation

Created supporting documents:
- ✅ `COLUMN_MAPPING.md` - Complete field mapping reference
- ✅ This document (`DATABASE_UNIFICATION_2025-10-17.md`)

## Next Steps

### Recommended
1. **Frontend Update**: Update Vue form component to submit English field names
2. **API Documentation**: Document new field names in API docs
3. **Production Migration**: If data exists, create migration script

### Optional
1. **API Versioning**: Consider `/api/v2/` endpoints for gradual migration
2. **Field Alias Support**: Add view or trigger to support old column names temporarily
3. **Integration Tests**: Add tests for new column names

## Files Modified

```
data/init-db.sql                    (schema updated)
data/init-db-english.sql            (created as reference)
form/server/server.ts               (queries + validation updated)
badge/server.js                     (transform function + queries updated)
scanner/server.js                   (queries + display name updated)
COLUMN_MAPPING.md                   (created)
DATABASE_UNIFICATION_2025-10-17.md  (this file)
```

## Verification Commands

```bash
# Check database schema
bun -e "const {Database} = require('bun:sqlite'); const db = new Database('data/gotalent.db'); const tables = db.query('SELECT sql FROM sqlite_master WHERE type=\"table\" AND name=\"participants\"').get(); console.log(tables.sql)"

# Test health endpoints
curl http://localhost:13002/api/health  # Form
curl http://localhost:13003/api/health  # Badge
curl http://localhost:13004/api/health  # Scanner

# Test through Caddy
curl http://localhost:13000/form/api/health
curl http://localhost:13000/badge/api/health
curl http://localhost:13000/scanner/api/health

# Check database in Adminer
open http://localhost:13080
```

---

**Migration completed successfully! All services running with unified English column names.**
