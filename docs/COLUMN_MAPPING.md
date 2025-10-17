# Database Column Name Mapping

## Column Name Changes (French → English)

### Participants Table

| Old Name (French/Mixed) | New Name (English) | Notes |
|------------------------|-------------------|-------|
| `nom` | `last_name` | Last name |
| `prenom` | `first_name` | First name |
| `post_nom` | `middle_name` | Middle name |
| `name` | `full_name` | Full name (computed) |
| `sexe` / `gender` | `gender` | **MERGED** - was duplicated |
| `date_naissance` | `date_of_birth` | Date of birth |
| `telephone` / `contact_number` | `phone` | **MERGED** - was duplicated |
| `adresse` | `address` | Address |
| `diplome` | `degree` | Degree/diploma |
| `etablissement` | `institution` | Educational institution |
| `annee_obtention` | `graduation_year` | Year of graduation |
| `poste` | `position` | Job position |
| `entreprise` | `company` | Company |
| `annees_experience` | `years_of_experience` | Years of experience |
| `description_poste` | `position_description` | Position description |
| `expertise_domain` | `expertise_domain` | **NO CHANGE** |
| `comment_entendu` / `how_heard` | `how_heard` | **MERGED** - How heard about event (JSON) |
| `attentes` / `expectations` / `objectives` | `expectations` | **MERGED** - Expectations (JSON) |
| `commentaires_supplementaires` | `additional_comments` | Additional comments |
| `accepte_termes` | `terms_accepted` | Terms accepted |
| `accepte_utilisation_donnees` | `data_usage_accepted` | Data usage accepted |
| `souhaite_informations_futures` | `future_info_accepted` | Future info accepted |
| `timestamp` | **REMOVED** | Redundant with created_at |
| `created_at` | `created_at` | **NO CHANGE** |
| `updated_at` | `updated_at` | **NO CHANGE** |

### Payment Table

| Old Name (French) | New Name (English) | Notes |
|------------------|-------------------|-------|
| `paiement` (table) | `payment` | Table name |
| `montant` | `amount` | Amount |
| `date_paiement` | `payment_date` | Payment date |

## Duplicate Columns Removed

1. **Gender**: `sexe` and `gender` → unified to `gender`
2. **Phone**: `telephone` and `contact_number` → unified to `phone`
3. **Full Name**: `name` → renamed to `full_name` for clarity
4. **How Heard**: `comment_entendu` and `how_heard` → unified to `how_heard`
5. **Expectations**: `attentes`, `expectations`, `objectives` → unified to `expectations`

## Migration Strategy

1. Backup existing database (if any data exists)
2. Replace `init-db.sql` with new English schema
3. Update all service code to use new column names:
   - Form service (`form/server/server.ts`)
   - Badge service (`badge/server.js`)
   - Scanner service (`scanner/server.js`)
4. Restart all services to use new schema

## Code Update Checklist

### Form Service Updates
- [ ] Update INSERT query column names
- [ ] Update SELECT query column names
- [ ] Update validation function to use English names
- [ ] Update request body field mapping

### Badge Service Updates
- [ ] Update SELECT queries
- [ ] Update transformParticipant() function
- [ ] Update search queries

### Scanner Service Updates
- [ ] Update SELECT queries
- [ ] Update check-registration logic
- [ ] Update display name computation

## API Field Mapping (for backward compatibility)

If the frontend still sends French field names, map them in the server:

```javascript
const fieldMapping = {
  // French to English
  nom: 'last_name',
  prenom: 'first_name',
  postNom: 'middle_name',
  sexe: 'gender',
  dateNaissance: 'date_of_birth',
  telephone: 'phone',
  adresse: 'address',
  diplome: 'degree',
  etablissement: 'institution',
  anneeObtention: 'graduation_year',
  poste: 'position',
  entreprise: 'company',
  anneesExperience: 'years_of_experience',
  descriptionPoste: 'position_description',
  commentEntendu: 'how_heard',
  attentes: 'expectations',
  commentairesSupplementaires: 'additional_comments',
  accepteTermes: 'terms_accepted',
  accepteUtilisationDonnees: 'data_usage_accepted',
  souhaiteInformationsFutures: 'future_info_accepted'
};
```
