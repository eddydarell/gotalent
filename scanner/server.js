import { Database } from "bun:sqlite";
import { join } from "path";

const PORT = process.env.PORT || 3004;
const DATABASE_PATH = process.env.DATABASE_PATH || join(import.meta.dir, "..", "data", "gotalent.db");

// Database connection
const db = new Database(DATABASE_PATH);
console.log(`Connected to SQLite database at: ${DATABASE_PATH}`);

// Utility function to normalize phone numbers
function normalizePhone(phone) {
  return phone.replace(/[\s+\-()]/g, '');
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
        const query = db.query("SELECT * FROM participants");
        const participants = query.all();
        
        return new Response(JSON.stringify(participants), {
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
    
    // API: Check registration by email or phone
    if (path === "/api/check-registration" && req.method === "GET") {
      const email = url.searchParams.get("email");
      const phone = url.searchParams.get("phone");
      
      if (!email && !phone) {
        return new Response(
          JSON.stringify({ error: "Email or phone parameter required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      try {
        let query;
        let params = [];
        
        if (email && phone) {
          // Search by email or phone
          const normalizedPhone = normalizePhone(phone);
          query = db.query(`
            SELECT * FROM participants 
            WHERE LOWER(email) = LOWER(?)
               OR REPLACE(REPLACE(REPLACE(phone, " ", ""), "+", ""), "-", "") LIKE ?
            LIMIT 1
          `);
          params = [email, `%${normalizedPhone}%`];
        } else if (email) {
          query = db.query("SELECT * FROM participants WHERE LOWER(email) = LOWER(?) LIMIT 1");
          params = [email];
        } else {
          const normalizedPhone = normalizePhone(phone);
          query = db.query(`
            SELECT * FROM participants 
            WHERE REPLACE(REPLACE(REPLACE(phone, " ", ""), "+", ""), "-", "") LIKE ?
            LIMIT 1
          `);
          params = [`%${normalizedPhone}%`];
        }
        
        const row = query.get(...params);
        
        if (row) {
          // Compute display name
          const displayName = row.full_name || 
                            [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" ") ||
                            (row.email ? row.email.split('@')[0] : "Participant");
          
          return new Response(
            JSON.stringify({
              isRegistered: true,
              participant: {
                ...row,
                name: displayName,
                full_name: displayName,
              },
              matchedBy: email && row.email ? "Email" : "Numéro de téléphone",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          return new Response(
            JSON.stringify({
              isRegistered: false,
              participant: null,
              matchedBy: null,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (err) {
        console.error("Database query error:", err);
        return new Response(
          JSON.stringify({ error: "Database query failed" }),
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

console.log(`🚀 Scanner service running on http://localhost:${PORT}`);
console.log(`📊 API endpoints:`);
console.log(`   GET /api/participants - Get all participants`);
console.log(`   GET /api/check-registration?email=...&phone=... - Check registration`);
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
