import { Database } from "bun:sqlite";
import { join } from "path";

const PORT = process.env.PORT || 3003;
const DATABASE_PATH = process.env.DATABASE_PATH || join(import.meta.dir, "..", "data", "gotalent.db");

// Database connection
const db = new Database(DATABASE_PATH);
console.log(`Connected to SQLite database at: ${DATABASE_PATH}`);

// Helper function to transform participant data
function transformParticipant(participant) {
  if (!participant) return null;

  const displayName = participant.full_name || 
                     [participant.first_name, participant.middle_name, participant.last_name].filter(Boolean).join(" ") ||
                     (participant.email ? participant.email.split('@')[0] : "Participant");

  return {
    id: participant.id,
    name: displayName,
    email: participant.email,
    phone: participant.phone || "N/A",
    company: participant.company || participant.expertise_domain || "N/A",
    position: participant.position || participant.expertise_domain || "Participant",
    gender: participant.gender || "N/A",
    education: participant.degree || "N/A",
    domain: participant.expertise_domain || "N/A",
    experience: participant.years_of_experience || "N/A",
    registrationDate: participant.created_at || new Date().toISOString(),
    status: participant.status || "registered"
  };
}

// Create server
const server = Bun.serve({
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
    
    // API: Get all participants
    if (path === "/api/participants" && req.method === "GET") {
      try {
        const query = db.query("SELECT * FROM participants ORDER BY created_at DESC");
        const participants = query.all();
        const transformed = participants.map(transformParticipant);
        
        return new Response(JSON.stringify(transformed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Database query error:", err);
        return new Response(
          JSON.stringify({ error: "Database query failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Get participant by email (GET with email in URL path)
    if (path.startsWith("/api/participants/email/") && req.method === "GET") {
      const email = decodeURIComponent(path.split("/api/participants/email/")[1]);
      try {
        if (!email) {
          return new Response(
            JSON.stringify({ error: "Email is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const participant = db.query("SELECT * FROM participants WHERE LOWER(email) = LOWER(?)").get(email);
        
        if (!participant) {
          return new Response(
            JSON.stringify({ error: "Participant not found", email: email }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify(transformParticipant(participant)), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Database query error:", err);
        return new Response(
          JSON.stringify({ error: "Database query failed", details: err.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Get participant by ID
    if (path.startsWith("/api/participants/") && req.method === "GET" && !path.includes("search") && !path.includes("email")) {
      const id = path.split("/").pop();
      try {
        const participant = db.query("SELECT * FROM participants WHERE id = ?").get(id);
        
        if (!participant) {
          return new Response(
            JSON.stringify({ error: "Participant not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify(transformParticipant(participant)), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Database query error:", err);
        return new Response(
          JSON.stringify({ error: "Database query failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Get participant by email (POST with email in body - kept for backward compatibility)
    if (path === "/api/participants/email" && req.method === "POST") {
      try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
          return new Response(
            JSON.stringify({ error: "Email is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const participant = db.query("SELECT * FROM participants WHERE email = ?").get(email);
        
        if (!participant) {
          return new Response(
            JSON.stringify({ error: "Participant not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify(transformParticipant(participant)), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Error:", err);
        return new Response(
          JSON.stringify({ error: "Failed to fetch participant" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Search participants
    if (path === "/api/participants/search" && req.method === "GET") {
      const searchTerm = url.searchParams.get("q") || "";
      
      try {
        const queryStr = `
          SELECT * FROM participants 
          WHERE full_name LIKE ? 
             OR first_name LIKE ? 
             OR last_name LIKE ? 
             OR middle_name LIKE ?
             OR email LIKE ?
          ORDER BY created_at DESC
        `;
        const searchPattern = `%${searchTerm}%`;
        const participants = db.query(queryStr).all(
          searchPattern, searchPattern, searchPattern, searchPattern, searchPattern
        );
        
        const transformed = participants.map(transformParticipant);
        
        return new Response(JSON.stringify(transformed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Error searching:", err);
        return new Response(
          JSON.stringify({ error: "Failed to search participants" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Get statistics
    if (path === "/api/stats" && req.method === "GET") {
      try {
        const total = db.query("SELECT COUNT(*) as count FROM participants").get();
        const byGender = db.query(`
          SELECT 
            COALESCE(gender, sexe, 'Unknown') as gender, 
            COUNT(*) as count 
          FROM participants 
          GROUP BY COALESCE(gender, sexe, 'Unknown')
        `).all();
        
        const byEducation = db.query(`
          SELECT 
            COALESCE(niveau_etude, 'Unknown') as education, 
            COUNT(*) as count 
          FROM participants 
          WHERE niveau_etude IS NOT NULL
          GROUP BY niveau_etude
        `).all();

        return new Response(JSON.stringify({
          total: total.count,
          byGender,
          byEducation
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        return new Response(
          JSON.stringify({ error: "Failed to fetch statistics" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Get participant count
    if (path === "/api/count" && req.method === "GET") {
      try {
        const result = db.query("SELECT COUNT(*) as count FROM participants").get();
        return new Response(JSON.stringify({ count: result.count }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Error counting:", err);
        return new Response(
          JSON.stringify({ error: "Failed to count participants" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // API: Health check
    if (path === "/api/health" && req.method === "GET") {
      return new Response(
        JSON.stringify({ status: "OK", timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Serve static files from dist directory
    const distPath = join(import.meta.dir, "dist", path === "/" ? "index.html" : path.slice(1));
    const file = Bun.file(distPath);
    
    if (await file.exists()) {
      return new Response(file);
    }
    
    // 404 Not Found
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Badge service running on http://localhost:${PORT}`);
console.log(`📊 API endpoints:`);
console.log(`   GET /api/participants - Get all participants`);
console.log(`   GET /api/participants/:id - Get participant by ID`);
console.log(`   GET /api/participants/email/:email - Get participant by email (URL param)`);
console.log(`   POST /api/participants/email - Get participant by email (body)`);
console.log(`   GET /api/participants/search?q=term - Search participants`);
console.log(`   GET /api/stats - Get statistics`);
console.log(`   GET /api/count - Get participant count`);
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
