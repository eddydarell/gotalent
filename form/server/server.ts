import { Database } from "bun:sqlite";
import { join } from "path";

const PORT = process.env.PORT || 3002;
const DATABASE_PATH = process.env.DATABASE_PATH || join(import.meta.dir, "..", "data", "gotalent.db");

// Database connection
const db = new Database(DATABASE_PATH);
console.log(`Connected to SQLite database at: ${DATABASE_PATH}`);

// Field mapping for backward compatibility (French to English)
const fieldMap: Record<string, string> = {
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

// Transform frontend data to database format
function transformData(data: any): any {
  const transformed: any = {};
  for (const [key, value] of Object.entries(data)) {
    const dbKey = fieldMap[key] || key;
    let transformedValue = value;
    
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
    
    transformed[dbKey] = transformedValue;
  }
  return transformed;
}

// Validation function
function validateFormData(data: any): string[] {
  const errors: string[] = [];

  if (!data.last_name?.trim()) errors.push('Le nom est requis');
  if (!data.gender?.trim()) errors.push('Le sexe est requis');
  if (!data.email?.trim()) errors.push("L'email est requis");
  if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Format d'email invalide");
  }
  if (!data.degree?.trim()) errors.push('Le diplôme est requis');
  if (!data.institution?.trim()) errors.push("L'établissement est requis");
  if (!data.graduation_year) errors.push("L'année d'obtention est requise");
  if (!data.position?.trim()) errors.push('Le poste est requis');
  if (!Array.isArray(data.how_heard) || data.how_heard.length === 0) {
    errors.push("Veuillez sélectionner comment vous avez entendu parler de l'événement");
  }
  if (!Array.isArray(data.expectations) || data.expectations.length === 0) {
    errors.push('Veuillez sélectionner vos attentes');
  }
  if (!data.terms_accepted) {
    errors.push('Vous devez accepter les termes et conditions');
  }
  if (!data.data_usage_accepted) {
    errors.push("Vous devez accepter l'utilisation de vos données");
  }

  return errors;
}

// Create server
Bun.serve({
  port: PORT,
  
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Enable CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Handle OPTIONS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // API: Health check
    if (path === "/api/health" && req.method === "GET") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // API: Get all inscriptions
    if (path === "/api/inscriptions" && req.method === "GET") {
      try {
        const query = db.query(`
          SELECT 
            id, first_name, last_name, middle_name, gender, date_of_birth, email, phone, address,
            degree, institution, graduation_year, position, company, years_of_experience,
            position_description, how_heard, expectations, additional_comments,
            terms_accepted, data_usage_accepted, future_info_accepted,
            created_at, updated_at
          FROM participants 
          WHERE degree IS NOT NULL
          ORDER BY created_at DESC
        `);
        
        const inscriptions = query.all();
        
        // Parse JSON fields
        const formatted = inscriptions.map((inscription: any) => ({
          ...inscription,
          how_heard: inscription.how_heard 
            ? JSON.parse(inscription.how_heard) 
            : [],
          expectations: inscription.expectations 
            ? JSON.parse(inscription.expectations) 
            : [],
        }));

        return new Response(
          JSON.stringify({
            success: true,
            data: formatted,
            count: formatted.length
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("Error fetching inscriptions:", err);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Erreur lors de la récupération des inscriptions"
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Create new inscription
    if (path === "/api/inscriptions" && req.method === "POST") {
      try {
        const rawData = await req.json();
        
        // Transform French field names to English
        const data = transformData(rawData);
        
        // Validate data
        const errors = validateFormData(data);
        if (errors.length > 0) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Erreurs de validation",
              errors
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if email already exists
        const checkQuery = db.query("SELECT id FROM participants WHERE email = ? LIMIT 1");
        const existing = checkQuery.get(data.email);

        if (existing) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Cette adresse email est déjà utilisée pour une inscription"
            }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Insert new inscription
        const insertQuery = db.query(`
          INSERT INTO participants (
            first_name, last_name, middle_name, gender, date_of_birth, email, phone, address,
            degree, institution, graduation_year, position, company, years_of_experience,
            position_description, how_heard, expectations, additional_comments,
            terms_accepted, data_usage_accepted, future_info_accepted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = insertQuery.run(
          data.first_name || null,
          data.last_name,
          data.middle_name || null,
          data.gender,
          data.date_of_birth || null,
          data.email,
          data.phone || null,
          data.address || null,
          data.degree,
          data.institution,
          data.graduation_year,
          data.position,
          data.company || null,
          data.years_of_experience || null,
          data.position_description || null,
          JSON.stringify(data.how_heard),
          JSON.stringify(data.expectations),
          data.additional_comments || null,
          data.terms_accepted ? 1 : 0,
          data.data_usage_accepted ? 1 : 0,
          data.future_info_accepted ? 1 : 0
        );

        return new Response(
          JSON.stringify({
            success: true,
            message: "Inscription enregistrée avec succès!",
            data: { id: result.lastInsertRowid }
          }),
          { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("Error creating inscription:", err);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Erreur lors de l'enregistrement de l'inscription"
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Get inscription by ID
    if (path.match(/^\/api\/inscriptions\/\d+$/) && req.method === "GET") {
      try {
        const id = parseInt(path.split("/api/inscriptions/")[1]);
        
        const query = db.query(`
          SELECT 
            id, nom, post_nom, prenom, sexe, date_naissance, email, telephone, adresse,
            diplome, etablissement, annee_obtention, poste, entreprise, annees_experience,
            description_poste, comment_entendu, attentes, commentaires_supplementaires,
            accepte_termes, accepte_utilisation_donnees, souhaite_informations_futures,
            created_at, updated_at
          FROM participants 
          WHERE id = ? AND diplome IS NOT NULL
          LIMIT 1
        `);
        
        const inscription = query.get(id);

        if (!inscription) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Inscription non trouvée"
            }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Parse JSON fields
        const formatted = {
          ...inscription,
          comment_entendu: inscription.comment_entendu 
            ? JSON.parse(inscription.comment_entendu) 
            : [],
          attentes: inscription.attentes 
            ? JSON.parse(inscription.attentes) 
            : [],
        };

        return new Response(
          JSON.stringify({
            success: true,
            data: formatted
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("Error fetching inscription:", err);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Erreur lors de la récupération de l'inscription"
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Statistics
    if (path === "/api/statistics" && req.method === "GET") {
      try {
        const totalQuery = db.query("SELECT COUNT(*) as count FROM participants WHERE diplome IS NOT NULL");
        const total = totalQuery.get();
        
        const sexeQuery = db.query(`
          SELECT sexe, COUNT(*) as count 
          FROM participants 
          WHERE diplome IS NOT NULL AND sexe IS NOT NULL
          GROUP BY sexe
        `);
        const sexeStats = sexeQuery.all();

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              total: total.count || 0,
              sexe: sexeStats
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("Error fetching statistics:", err);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Erreur lors de la récupération des statistiques"
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Serve static files from dist directory
    const distPath = join(import.meta.dir, "..", "dist", path === "/" ? "index.html" : path.slice(1));
    const file = Bun.file(distPath);
    
    if (await file.exists()) {
      return new Response(file);
    }
    
    // Fallback to index.html for SPA routing
    const indexFile = Bun.file(join(import.meta.dir, "..", "dist", "index.html"));
    if (await indexFile.exists()) {
      return new Response(indexFile);
    }
    
    // 404 Not Found
    return new Response(
      JSON.stringify({
        success: false,
        message: "Endpoint non trouvé"
      }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },
});

console.log(`🚀 Form service running on http://localhost:${PORT}`);
console.log(`📊 API endpoints:`);
console.log(`   GET /api/inscriptions - Get all inscriptions`);
console.log(`   POST /api/inscriptions - Create inscription`);
console.log(`   GET /api/inscriptions/:id - Get inscription by ID`);
console.log(`   GET /api/statistics - Get statistics`);
console.log(`   GET /api/health - Health check`);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  db.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down gracefully...");
  db.close();
  process.exit(0);
});
