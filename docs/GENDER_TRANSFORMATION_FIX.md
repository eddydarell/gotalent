# Gender Value Transformation Fix

**Date**: October 17, 2025  
**Issue**: Form service gender CHECK constraint failure  
**Status**: ✅ **RESOLVED**

## Problem

When creating inscriptions through the form service, the database CHECK constraint was failing:

```
SQLiteError: CHECK constraint failed: gender IN ('M', 'F', 'Autre')
```

### Root Cause

**Frontend sends:**
- "Masculin"
- "Féminin"
- "Autre"
- "Préfère ne pas dire"

**Database expects:**
- 'M' (Male)
- 'F' (Female)
- 'Autre' (Other)

### Mismatch
The Vue form (`form/src/components/steps/PersonalInfoStep.vue`) uses full French text values, but the database CHECK constraint expects single-letter codes.

## Solution

Added gender value transformation in the `transformData()` function in `form/server/server.ts`:

```typescript
// Transform gender values to match database CHECK constraint: 'M', 'F', 'Autre'
if (dbKey === 'gender' && typeof value === 'string') {
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'masculin' || lowerValue === 'homme' || value === 'H' || value === 'M') {
    transformedValue = 'M';
  } else if (lowerValue === 'féminin' || lowerValue === 'feminin' || lowerValue === 'femme' || value === 'F') {
    transformedValue = 'F';
  } else if (lowerValue === 'autre' || lowerValue === 'other' || lowerValue === 'préfère ne pas dire' || lowerValue === 'prefere ne pas dire') {
    transformedValue = 'Autre';
  }
  // If none match, keep original value (will fail CHECK constraint and show error)
}
```

### Transformation Mapping

| Frontend Value | Database Value |
|---------------|---------------|
| "Masculin" | 'M' |
| "Homme" | 'M' |
| "H" | 'M' |
| "Féminin" | 'F' |
| "Feminin" (no accent) | 'F' |
| "Femme" | 'F' |
| "Autre" | 'Autre' |
| "Other" | 'Autre' |
| "Préfère ne pas dire" | 'Autre' |
| "Prefere ne pas dire" (no accent) | 'Autre' |

## Testing Results

### Test 1: Masculin → M ✅
```bash
curl -X POST /api/inscriptions -d '{"sexe":"Masculin",...}'
```
**Result:** 
```json
{
  "id": 4,
  "gender": "M",
  "name": "User Test"
}
```

### Test 2: Féminin → F ✅
```bash
curl -X POST /api/inscriptions -d '{"sexe":"Féminin",...}'
```
**Result:**
```json
{
  "id": 5,
  "gender": "F",
  "name": "Test Femme"
}
```

### Test 3: Préfère ne pas dire → Autre ✅
```bash
curl -X POST /api/inscriptions -d '{"sexe":"Préfère ne pas dire",...}'
```
**Result:**
```json
{
  "id": 6,
  "gender": "Autre",
  "name": "Test Other"
}
```

## Benefits

### 1. User-Friendly Frontend ✅
- Users see full, clear French labels: "Masculin", "Féminin", "Autre"
- Better UX than single letters or codes

### 2. Database Integrity ✅
- CHECK constraint ensures data consistency
- Only valid values ('M', 'F', 'Autre') stored
- Invalid values rejected with clear error

### 3. Backward Compatibility ✅
- Supports multiple input formats (with/without accents)
- Works with both full words and abbreviations
- Graceful handling of edge cases

### 4. Maintainability ✅
- Transformation logic centralized in one place
- Easy to add new gender options if needed
- Clear documentation of expected values

## Implementation

### File Modified
- `form/server/server.ts` - Updated `transformData()` function

### Service Rebuilt
```bash
docker compose up -d --build form
```

### Verification Commands
```bash
# Test Masculin
curl -X POST http://localhost:13000/form/api/inscriptions \
  -H "Content-Type: application/json" \
  -d '{"sexe":"Masculin",...}'

# Test Féminin
curl -X POST http://localhost:13000/form/api/inscriptions \
  -H "Content-Type: application/json" \
  -d '{"sexe":"Féminin",...}'

# Test Autre
curl -X POST http://localhost:13000/form/api/inscriptions \
  -H "Content-Type: application/json" \
  -d '{"sexe":"Autre",...}'

# Verify saved data
curl http://localhost:13000/form/api/inscriptions
```

## Database Schema

The CHECK constraint in `data/init-db.sql`:

```sql
gender TEXT CHECK(gender IN ('M', 'F', 'Autre'))
```

This ensures:
- Only 'M', 'F', or 'Autre' can be stored
- Database maintains data integrity
- Invalid values are immediately rejected

## Frontend Options

Current options in `form/src/components/steps/PersonalInfoStep.vue`:

```typescript
const sexeOptions = [
  { title: 'Masculin', value: 'Masculin' },
  { title: 'Féminin', value: 'Féminin' },
  { title: 'Autre', value: 'Autre' },
  { title: 'Préfère ne pas dire', value: 'Préfère ne pas dire' }
]
```

**Note:** These user-friendly labels are automatically transformed to database format ('M', 'F', 'Autre') by the server.

## Error Handling

If an invalid gender value is sent (not matching any transformation rule), the original value is kept and the database CHECK constraint will fail with a clear error:

```
SQLiteError: CHECK constraint failed: gender IN ('M', 'F', 'Autre')
```

This ensures data integrity while providing clear feedback.

## Related Changes

This fix complements the database column unification completed earlier:
- ✅ French column names → English column names
- ✅ Duplicate columns removed (sexe + gender → gender only)
- ✅ Value transformation added (Masculin/Féminin → M/F)

## Future Considerations

### Option 1: Update Database Constraint
Change CHECK constraint to accept full French words:
```sql
gender TEXT CHECK(gender IN ('Masculin', 'Féminin', 'Autre'))
```
**Pros:** No transformation needed  
**Cons:** Longer storage, less standard

### Option 2: Keep Current Approach (Recommended)
**Pros:** 
- Standard single-letter codes
- Less storage space
- Industry standard
- Server handles transformation

**Cons:**
- Requires transformation logic

**Decision:** Keep current approach with transformation layer ✅

---

## Summary

✅ **Issue Resolved**

Gender value transformation successfully implemented. Form service now accepts user-friendly French gender labels ("Masculin", "Féminin", "Autre", "Préfère ne pas dire") and automatically transforms them to database-compliant values ('M', 'F', 'Autre').

All tests passed. Service deployed and operational.

---

**Fixed by**: Copilot  
**Date**: October 17, 2025  
**Service**: Form (13002)  
**Files Modified**: `form/server/server.ts`
