[38;2;131;148;150m   1[0m [38;2;248;248;242mimport { Database } from "bun:sqlite";[0m
[38;2;131;148;150m   2[0m [38;2;248;248;242mimport { join } from "path";[0m
[38;2;131;148;150m   3[0m 
[38;2;131;148;150m   4[0m [38;2;248;248;242mconst PORT = process.env.PORT || 3003;[0m
[38;2;131;148;150m   5[0m [38;2;248;248;242mconst DATABASE_PATH = process.env.DATABASE_PATH || join(import.meta.dir, "..", "data", "gotalent.db");[0m
[38;2;131;148;150m   6[0m 
[38;2;131;148;150m   7[0m [38;2;248;248;242m// Database connection[0m
[38;2;131;148;150m   8[0m [38;2;248;248;242mconst db = new Database(DATABASE_PATH);[0m
[38;2;131;148;150m   9[0m [38;2;248;248;242mconsole.log(\`Connected to SQLite database at: \${DATABASE_PATH}\`);[0m
[38;2;131;148;150m  10[0m 
[38;2;131;148;150m  11[0m [38;2;248;248;242m// Helper function to transform participant data[0m
[38;2;131;148;150m  12[0m [38;2;248;248;242mfunction transformParticipant(participant) {[0m
[38;2;131;148;150m  13[0m [38;2;248;248;242m  if (!participant) return null;[0m
[38;2;131;148;150m  14[0m 
[38;2;131;148;150m  15[0m [38;2;248;248;242m  const displayName = participant.name || [0m
[38;2;131;148;150m  16[0m [38;2;248;248;242m                     [participant.nom, participant.post_nom, participant.prenom].filter(Boolean).join(" ") ||[0m
[38;2;131;148;150m  17[0m [38;2;248;248;242m                     (participant.email ? participant.email.split("@")[0] : "Participant");[0m
[38;2;131;148;150m  18[0m 
[38;2;131;148;150m  19[0m [38;2;248;248;242m  return {[0m
[38;2;131;148;150m  20[0m [38;2;248;248;242m    id: participant.id,[0m
[38;2;131;148;150m  21[0m [38;2;248;248;242m    name: displayName,[0m
[38;2;131;148;150m  22[0m [38;2;248;248;242m    email: participant.email,[0m
[38;2;131;148;150m  23[0m [38;2;248;248;242m    phone: participant.contact_number || participant.telephone || "N/A",[0m
[38;2;131;148;150m  24[0m [38;2;248;248;242m    company: participant.entreprise || participant.expertise_domain || "N/A",[0m
[38;2;131;148;150m  25[0m [38;2;248;248;242m    position: participant.poste || participant.expertise_domain || "Participant",[0m
[38;2;131;148;150m  26[0m [38;2;248;248;242m    gender: participant.gender || participant.sexe || "N/A",[0m
[38;2;131;148;150m  27[0m [38;2;248;248;242m    education: participant.niveau_etude || "N/A",[0m
[38;2;131;148;150m  28[0m [38;2;248;248;242m    domain: participant.expertise_domain || participant.domaine || "N/A",[0m
[38;2;131;148;150m  29[0m [38;2;248;248;242m    experience: participant.annee_experience || participant.experience || "N/A",[0m
[38;2;131;148;150m  30[0m [38;2;248;248;242m    registrationDate: participant.created_at || new Date().toISOString(),[0m
[38;2;131;148;150m  31[0m [38;2;248;248;242m    status: participant.status || "registered"[0m
[38;2;131;148;150m  32[0m [38;2;248;248;242m  };[0m
[38;2;131;148;150m  33[0m [38;2;248;248;242m}[0m
[38;2;131;148;150m  34[0m 
[38;2;131;148;150m  35[0m [38;2;248;248;242m// CORS headers helper[0m
[38;2;131;148;150m  36[0m [38;2;248;248;242mfunction corsHeaders() {[0m
[38;2;131;148;150m  37[0m [38;2;248;248;242m  return {[0m
[38;2;131;148;150m  38[0m [38;2;248;248;242m    "Access-Control-Allow-Origin": "*",[0m
[38;2;131;148;150m  39[0m [38;2;248;248;242m    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",[0m
[38;2;131;148;150m  40[0m [38;2;248;248;242m    "Access-Control-Allow-Headers": "Content-Type",[0m
[38;2;131;148;150m  41[0m [38;2;248;248;242m    "Content-Type": "application/json"[0m
[38;2;131;148;150m  42[0m [38;2;248;248;242m  };[0m
[38;2;131;148;150m  43[0m [38;2;248;248;242m}[0m
[38;2;131;148;150m  44[0m 
[38;2;131;148;150m  45[0m [38;2;248;248;242m// Create Bun server[0m
[38;2;131;148;150m  46[0m [38;2;248;248;242mconst server = Bun.serve({[0m
[38;2;131;148;150m  47[0m [38;2;248;248;242m  port: PORT,[0m
[38;2;131;148;150m  48[0m [38;2;248;248;242m  async fetch(req) {[0m
[38;2;131;148;150m  49[0m [38;2;248;248;242m    const url = new URL(req.url);[0m
[38;2;131;148;150m  50[0m [38;2;248;248;242m    const pathname = url.pathname;[0m
[38;2;131;148;150m  51[0m 
[38;2;131;148;150m  52[0m [38;2;248;248;242m    // Handle CORS preflight[0m
[38;2;131;148;150m  53[0m [38;2;248;248;242m    if (req.method === "OPTIONS") {[0m
[38;2;131;148;150m  54[0m [38;2;248;248;242m      return new Response(null, { [0m
[38;2;131;148;150m  55[0m [38;2;248;248;242m        status: 204, [0m
[38;2;131;148;150m  56[0m [38;2;248;248;242m        headers: corsHeaders() [0m
[38;2;131;148;150m  57[0m [38;2;248;248;242m      });[0m
[38;2;131;148;150m  58[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m  59[0m 
[38;2;131;148;150m  60[0m [38;2;248;248;242m    // Health check endpoint[0m
[38;2;131;148;150m  61[0m [38;2;248;248;242m    if (pathname === "/api/health") {[0m
[38;2;131;148;150m  62[0m [38;2;248;248;242m      return new Response(JSON.stringify({ [0m
[38;2;131;148;150m  63[0m [38;2;248;248;242m        status: "ok", [0m
[38;2;131;148;150m  64[0m [38;2;248;248;242m        service: "badge",[0m
[38;2;131;148;150m  65[0m [38;2;248;248;242m        database: DATABASE_PATH [0m
[38;2;131;148;150m  66[0m [38;2;248;248;242m      }), {[0m
[38;2;131;148;150m  67[0m [38;2;248;248;242m        headers: corsHeaders()[0m
[38;2;131;148;150m  68[0m [38;2;248;248;242m      });[0m
[38;2;131;148;150m  69[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m  70[0m 
[38;2;131;148;150m  71[0m [38;2;248;248;242m    // Get all participants[0m
[38;2;131;148;150m  72[0m [38;2;248;248;242m    if (pathname === "/api/participants" && req.method === "GET") {[0m
[38;2;131;148;150m  73[0m [38;2;248;248;242m      try {[0m
[38;2;131;148;150m  74[0m [38;2;248;248;242m        const participants = db.query("SELECT * FROM participants ORDER BY created_at DESC").all();[0m
[38;2;131;148;150m  75[0m [38;2;248;248;242m        const transformed = participants.map(transformParticipant);[0m
[38;2;131;148;150m  76[0m [38;2;248;248;242m        [0m
[38;2;131;148;150m  77[0m [38;2;248;248;242m        return new Response(JSON.stringify(transformed), {[0m
[38;2;131;148;150m  78[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m  79[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m  80[0m [38;2;248;248;242m      } catch (error) {[0m
[38;2;131;148;150m  81[0m [38;2;248;248;242m        console.error("Error fetching participants:", error);[0m
[38;2;131;148;150m  82[0m [38;2;248;248;242m        return new Response(JSON.stringify({ [0m
[38;2;131;148;150m  83[0m [38;2;248;248;242m          error: "Failed to fetch participants",[0m
[38;2;131;148;150m  84[0m [38;2;248;248;242m          message: error.message [0m
[38;2;131;148;150m  85[0m [38;2;248;248;242m        }), {[0m
[38;2;131;148;150m  86[0m [38;2;248;248;242m          status: 500,[0m
[38;2;131;148;150m  87[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m  88[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m  89[0m [38;2;248;248;242m      }[0m
[38;2;131;148;150m  90[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m  91[0m 
[38;2;131;148;150m  92[0m [38;2;248;248;242m    // Get participant by ID[0m
[38;2;131;148;150m  93[0m [38;2;248;248;242m    if (pathname.startsWith("/api/participants/") && req.method === "GET") {[0m
[38;2;131;148;150m  94[0m [38;2;248;248;242m      const id = pathname.split("/").pop();[0m
[38;2;131;148;150m  95[0m [38;2;248;248;242m      [0m
[38;2;131;148;150m  96[0m [38;2;248;248;242m      try {[0m
[38;2;131;148;150m  97[0m [38;2;248;248;242m        const participant = db.query("SELECT * FROM participants WHERE id = ?").get(id);[0m
[38;2;131;148;150m  98[0m [38;2;248;248;242m        [0m
[38;2;131;148;150m  99[0m [38;2;248;248;242m        if (!participant) {[0m
[38;2;131;148;150m 100[0m [38;2;248;248;242m          return new Response(JSON.stringify({ error: "Participant not found" }), {[0m
[38;2;131;148;150m 101[0m [38;2;248;248;242m            status: 404,[0m
[38;2;131;148;150m 102[0m [38;2;248;248;242m            headers: corsHeaders()[0m
[38;2;131;148;150m 103[0m [38;2;248;248;242m          });[0m
[38;2;131;148;150m 104[0m [38;2;248;248;242m        }[0m
[38;2;131;148;150m 105[0m 
[38;2;131;148;150m 106[0m [38;2;248;248;242m        return new Response(JSON.stringify(transformParticipant(participant)), {[0m
[38;2;131;148;150m 107[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 108[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 109[0m [38;2;248;248;242m      } catch (error) {[0m
[38;2;131;148;150m 110[0m [38;2;248;248;242m        console.error("Error fetching participant:", error);[0m
[38;2;131;148;150m 111[0m [38;2;248;248;242m        return new Response(JSON.stringify({ [0m
[38;2;131;148;150m 112[0m [38;2;248;248;242m          error: "Failed to fetch participant",[0m
[38;2;131;148;150m 113[0m [38;2;248;248;242m          message: error.message [0m
[38;2;131;148;150m 114[0m [38;2;248;248;242m        }), {[0m
[38;2;131;148;150m 115[0m [38;2;248;248;242m          status: 500,[0m
[38;2;131;148;150m 116[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 117[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 118[0m [38;2;248;248;242m      }[0m
[38;2;131;148;150m 119[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m 120[0m 
[38;2;131;148;150m 121[0m [38;2;248;248;242m    // Get participant by email[0m
[38;2;131;148;150m 122[0m [38;2;248;248;242m    if (pathname === "/api/participants/email" && req.method === "POST") {[0m
[38;2;131;148;150m 123[0m [38;2;248;248;242m      try {[0m
[38;2;131;148;150m 124[0m [38;2;248;248;242m        const body = await req.json();[0m
[38;2;131;148;150m 125[0m [38;2;248;248;242m        const { email } = body;[0m
[38;2;131;148;150m 126[0m 
[38;2;131;148;150m 127[0m [38;2;248;248;242m        if (!email) {[0m
[38;2;131;148;150m 128[0m [38;2;248;248;242m          return new Response(JSON.stringify({ error: "Email is required" }), {[0m
[38;2;131;148;150m 129[0m [38;2;248;248;242m            status: 400,[0m
[38;2;131;148;150m 130[0m [38;2;248;248;242m            headers: corsHeaders()[0m
[38;2;131;148;150m 131[0m [38;2;248;248;242m          });[0m
[38;2;131;148;150m 132[0m [38;2;248;248;242m        }[0m
[38;2;131;148;150m 133[0m 
[38;2;131;148;150m 134[0m [38;2;248;248;242m        const participant = db.query("SELECT * FROM participants WHERE email = ?").get(email);[0m
[38;2;131;148;150m 135[0m [38;2;248;248;242m        [0m
[38;2;131;148;150m 136[0m [38;2;248;248;242m        if (!participant) {[0m
[38;2;131;148;150m 137[0m [38;2;248;248;242m          return new Response(JSON.stringify({ error: "Participant not found" }), {[0m
[38;2;131;148;150m 138[0m [38;2;248;248;242m            status: 404,[0m
[38;2;131;148;150m 139[0m [38;2;248;248;242m            headers: corsHeaders()[0m
[38;2;131;148;150m 140[0m [38;2;248;248;242m          });[0m
[38;2;131;148;150m 141[0m [38;2;248;248;242m        }[0m
[38;2;131;148;150m 142[0m 
[38;2;131;148;150m 143[0m [38;2;248;248;242m        return new Response(JSON.stringify(transformParticipant(participant)), {[0m
[38;2;131;148;150m 144[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 145[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 146[0m [38;2;248;248;242m      } catch (error) {[0m
[38;2;131;148;150m 147[0m [38;2;248;248;242m        console.error("Error fetching participant by email:", error);[0m
[38;2;131;148;150m 148[0m [38;2;248;248;242m        return new Response(JSON.stringify({ [0m
[38;2;131;148;150m 149[0m [38;2;248;248;242m          error: "Failed to fetch participant",[0m
[38;2;131;148;150m 150[0m [38;2;248;248;242m          message: error.message [0m
[38;2;131;148;150m 151[0m [38;2;248;248;242m        }), {[0m
[38;2;131;148;150m 152[0m [38;2;248;248;242m          status: 500,[0m
[38;2;131;148;150m 153[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 154[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 155[0m [38;2;248;248;242m      }[0m
[38;2;131;148;150m 156[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m 157[0m 
[38;2;131;148;150m 158[0m [38;2;248;248;242m    // Search participants[0m
[38;2;131;148;150m 159[0m [38;2;248;248;242m    if (pathname === "/api/participants/search" && req.method === "GET") {[0m
[38;2;131;148;150m 160[0m [38;2;248;248;242m      const searchTerm = url.searchParams.get("q") || "";[0m
[38;2;131;148;150m 161[0m [38;2;248;248;242m      [0m
[38;2;131;148;150m 162[0m [38;2;248;248;242m      try {[0m
[38;2;131;148;150m 163[0m [38;2;248;248;242m        const query = \`[0m
[38;2;131;148;150m 164[0m [38;2;248;248;242m          SELECT * FROM participants [0m
[38;2;131;148;150m 165[0m [38;2;248;248;242m          WHERE name LIKE ? [0m
[38;2;131;148;150m 166[0m [38;2;248;248;242m             OR nom LIKE ? [0m
[38;2;131;148;150m 167[0m [38;2;248;248;242m             OR prenom LIKE ? [0m
[38;2;131;148;150m 168[0m [38;2;248;248;242m             OR post_nom LIKE ?[0m
[38;2;131;148;150m 169[0m [38;2;248;248;242m             OR email LIKE ?[0m
[38;2;131;148;150m 170[0m [38;2;248;248;242m          ORDER BY created_at DESC[0m
[38;2;131;148;150m 171[0m [38;2;248;248;242m        \`;[0m
[38;2;131;148;150m 172[0m [38;2;248;248;242m        const searchPattern = \`%\${searchTerm}%\`;[0m
[38;2;131;148;150m 173[0m [38;2;248;248;242m        const participants = db.query(query).all([0m
[38;2;131;148;150m 174[0m [38;2;248;248;242m          searchPattern, searchPattern, searchPattern, searchPattern, searchPattern[0m
[38;2;131;148;150m 175[0m [38;2;248;248;242m        );[0m
[38;2;131;148;150m 176[0m [38;2;248;248;242m        [0m
[38;2;131;148;150m 177[0m [38;2;248;248;242m        const transformed = participants.map(transformParticipant);[0m
[38;2;131;148;150m 178[0m [38;2;248;248;242m        [0m
[38;2;131;148;150m 179[0m [38;2;248;248;242m        return new Response(JSON.stringify(transformed), {[0m
[38;2;131;148;150m 180[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 181[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 182[0m [38;2;248;248;242m      } catch (error) {[0m
[38;2;131;148;150m 183[0m [38;2;248;248;242m        console.error("Error searching participants:", error);[0m
[38;2;131;148;150m 184[0m [38;2;248;248;242m      [0m
[38;2;131;148;150m 185[0m [38;2;248;248;242m   r e t u r n   n e wh eRaedseprosn:s ec(oJrSsOHNe.asdterrisn(g)i[0m
[38;2;131;148;150m 186[0m 
[38;2;131;148;150m 187[0m [38;2;248;248;242m [0m
[38;2;131;148;150m 188[0m [38;2;248;248;242m   [0m
[38;2;131;148;150m 189[0m [38;2;248;248;242m       [0m
[38;2;131;148;150m 190[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 191[0m [38;2;248;248;242m         [0m
[38;2;131;148;150m 192[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 193[0m [38;2;248;248;242m         [0m
[38;2;131;148;150m 194[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 195[0m [38;2;248;248;242m         [0m
[38;2;131;148;150m 196[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 197[0m [38;2;248;248;242m         [0m
[38;2;131;148;150m 198[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 199[0m [38;2;248;248;242m         [0m
[38;2;131;148;150m 200[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 201[0m [38;2;248;248;242m         [0m
[38;2;131;148;150m 202[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 203[0m [38;2;248;248;242m         [0m
[38;2;131;148;150m 204[0m [38;2;248;248;242m  } );[0m
[38;2;131;148;150m 205[0m [38;2;248;248;242m   }[0m
[38;2;131;148;150m 206[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m 207[0m 
[38;2;131;148;150m 208[0m [38;2;248;248;242m    // Get statistics[0m
[38;2;131;148;150m 209[0m [38;2;248;248;242m    if (pathname === "/api/stats" && req.method === "GET") {[0m
[38;2;131;148;150m 210[0m [38;2;248;248;242m      try {[0m
[38;2;131;148;150m 211[0m [38;2;248;248;242m        const total = db.query("SELECT COUNT(*) as count FROM participants").get();[0m
[38;2;131;148;150m 212[0m [38;2;248;248;242m        const byGender = db.query(\`[0m
[38;2;131;148;150m 213[0m [38;2;248;248;242m          SELECT [0m
[38;2;131;148;150m 214[0m [38;2;248;248;242m            COALESCE(gender, sexe, 'Unknown') as gender, [0m
[38;2;131;148;150m 215[0m [38;2;248;248;242m            COUNT(* ) [0m
[38;2;131;148;150m 216[0m [38;2;248;248;242ma s   c o u n t   [0m
[38;2;131;148;150m 217[0m [38;2;248;248;242m      C O A L E S C EF(RnOiMv epaaur_teitcuidpea,n t'sU n[0m
[38;2;131;148;150m 218[0m [38;2;248;248;242mk n o w n ' )   a s GROUP BY COALESCE(gender, sexe, 'Unknown')[0m
[38;2;131;148;150m 219[0m [38;2;248;248;242m        \`).all();[0m
[38;2;131;148;150m 220[0m [38;2;248;248;242m        [0m
[38;2;131;148;150m 221[0m [38;2;248;248;242m        const byEducation = db.query(\`[0m
[38;2;131;148;150m 222[0m [38;2;248;248;242m          SELECT education, [0m
[38;2;131;148;150m 223[0m [38;2;248;248;242m            COUNT(*) as count [0m
[38;2;131;148;150m 224[0m [38;2;248;248;242m          FROM participants [0m
[38;2;131;148;150m 225[0m [38;2;248;248;242m          WHERE niveau_etude IS NOT NULL[0m
[38;2;131;148;150m 226[0m [38;2;248;248;242m          GROUP BY niveau_etude[0m
[38;2;131;148;150m 227[0m [38;2;248;248;242m        \`).all();[0m
[38;2;131;148;150m 228[0m 
[38;2;131;148;150m 229[0m [38;2;248;248;242m        return new Response(JSON.stringify({[0m
[38;2;131;148;150m 230[0m [38;2;248;248;242m          total: total.count,[0m
[38;2;131;148;150m 231[0m [38;2;248;248;242m          byGender,[0m
[38;2;131;148;150m 232[0m [38;2;248;248;242m          byEducation[0m
[38;2;131;148;150m 233[0m [38;2;248;248;242m        }), {[0m
[38;2;131;148;150m 234[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 235[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 236[0m [38;2;248;248;242m      } catch (error) {[0m
[38;2;131;148;150m 237[0m [38;2;248;248;242m        console.error("Error fetching statistics:", error);[0m
[38;2;131;148;150m 238[0m [38;2;248;248;242m        return new Response(JSON.stringify({ [0m
[38;2;131;148;150m 239[0m [38;2;248;248;242m          error: "Failed to fetch statistics",[0m
[38;2;131;148;150m 240[0m [38;2;248;248;242m          message: error.message [0m
[38;2;131;148;150m 241[0m [38;2;248;248;242m        }), {[0m
[38;2;131;148;150m 242[0m [38;2;248;248;242m          status: 500,[0m
[38;2;131;148;150m 243[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 244[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 245[0m [38;2;248;248;242m      }[0m
[38;2;131;148;150m 246[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m 247[0m 
[38;2;131;148;150m 248[0m [38;2;248;248;242m    // Get participant count[0m
[38;2;131;148;150m 249[0m [38;2;248;248;242m    if (pathname === "/api/count" && req.method === "GET") {[0m
[38;2;131;148;150m 250[0m [38;2;248;248;242m      try {[0m
[38;2;131;148;150m 251[0m [38;2;248;248;242m        const result = db.query("SELECT COUNT(*) as count FROM participants").get();[0m
[38;2;131;148;150m 252[0m [38;2;248;248;242m        return new Response(JSON.stringify({ count: result.count }), {[0m
[38;2;131;148;150m 253[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 254[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 255[0m [38;2;248;248;242m      } catch (error) {[0m
[38;2;131;148;150m 256[0m [38;2;248;248;242m        console.error("Error counting participants:", error);[0m
[38;2;131;148;150m 257[0m [38;2;248;248;242m        return new Response(JSON.stringify({ [0m
[38;2;131;148;150m 258[0m [38;2;248;248;242m          error: "Failed to count participants",[0m
[38;2;131;148;150m 259[0m [38;2;248;248;242m          message: error.message [0m
[38;2;131;148;150m 260[0m [38;2;248;248;242m        }), {[0m
[38;2;131;148;150m 261[0m [38;2;248;248;242m          status: 500,[0m
[38;2;131;148;150m 262[0m [38;2;248;248;242m          headers: corsHeaders()[0m
[38;2;131;148;150m 263[0m [38;2;248;248;242m        });[0m
[38;2;131;148;150m 264[0m [38;2;248;248;242m      }[0m
[38;2;131;148;150m 265[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m 266[0m 
[38;2;131;148;150m 267[0m [38;2;248;248;242m    // Serve static files from dist directory[0m
[38;2;131;148;150m 268[0m [38;2;248;248;242m    const distPath = join(import.meta.dir, "dist");[0m
[38;2;131;148;150m 269[0m [38;2;248;248;242m    let filePath = join(distPath, pathname === "/" ? "index.html" : pathname.slice(1));[0m
[38;2;131;148;150m 270[0m 
[38;2;131;148;150m 271[0m [38;2;248;248;242m    // Check if file exists[0m
[38;2;131;148;150m 272[0m [38;2;248;248;242m    const file = Bun.file(filePath);[0m
[38;2;131;148;150m 273[0m [38;2;248;248;242m    const exists = await file.exists();[0m
[38;2;131;148;150m 274[0m 
[38;2;131;148;150m 275[0m [38;2;248;248;242m    if (!exists) {[0m
[38;2;131;148;150m 276[0m [38;2;248;248;242m      // If not found, serve index.html for SPA routing[0m
[38;2;131;148;150m 277[0m [38;2;248;248;242m      filePath = join(distPath, "index.html");[0m
[38;2;131;148;150m 278[0m [38;2;248;248;242m      const indexFile = Bun.file(filePath);[0m
[38;2;131;148;150m 279[0m [38;2;248;248;242m      if (await indexFile.exists()) {[0m
[38;2;131;148;150m 280[0m [38;2;248;248;242m        return new Response(indexFile);[0m
[38;2;131;148;150m 281[0m [38;2;248;248;242m      }[0m
[38;2;131;148;150m 282[0m [38;2;248;248;242m      return new Response("Not Found", { status: 404 });[0m
[38;2;131;148;150m 283[0m [38;2;248;248;242m    }[0m
[38;2;131;148;150m 284[0m 
[38;2;131;148;150m 285[0m [38;2;248;248;242m    return new Response(file);[0m
[38;2;131;148;150m 286[0m [38;2;248;248;242m  },[0m
[38;2;131;148;150m 287[0m [38;2;248;248;242m  error(error) {[0m
[38;2;131;148;150m 288[0m [38;2;248;248;242m    console.error("Server error:", error);[0m
[38;2;131;148;150m 289[0m [38;2;248;248;242m    return new Response(JSON.stringify({ [0m
[38;2;131;148;150m 290[0m [38;2;248;248;242m      error: "Internal server error",[0m
[38;2;131;148;150m 291[0m [38;2;248;248;242m      message: error.message [0m
[38;2;131;148;150m 292[0m [38;2;248;248;242m    }), {[0m
[38;2;131;148;150m 293[0m [38;2;248;248;242m      status: 500,[0m
[38;2;131;148;150m 294[0m [38;2;248;248;242m      headers: corsHeaders()[0m
[38;2;131;148;150m 295[0m [38;2;248;248;242m    });[0m
[38;2;131;148;150m 296[0m [38;2;248;248;242m  }[0m
[38;2;131;148;150m 297[0m [38;2;248;248;242m});[0m
[38;2;131;148;150m 298[0m 
[38;2;131;148;150m 299[0m [38;2;248;248;242mconsole.log(\`🚀 Badge service running on http://localhost:\${PORT}\`);[0m
[38;2;131;148;150m 300[0m [38;2;248;248;242mconsole.log(\`📊 API endpoints:\`);[0m
[38;2;131;148;150m 301[0m [38;2;248;248;242mconsole.log(\`   GET /api/participants - Get all participants\`);[0m
[38;2;131;148;150m 302[0m [38;2;248;248;242mconsole.log(\`   GET /api/participants/:id - Get participant by ID\`);[0m
[38;2;131;148;150m 303[0m [38;2;248;248;242mconsole.log(\`   POST /api/participants/email - Get participant by email\`);[0m
[38;2;131;148;150m 304[0m [38;2;248;248;242mconsole.log(\`   GET /api/participants/search?q=term - Search participants\`);[0m
[38;2;131;148;150m 305[0m [38;2;248;248;242mconsole.log(\`   GET /api/stats - Get statistics\`);[0m
[38;2;131;148;150m 306[0m [38;2;248;248;242mconsole.log(\`   GET /api/count - Get participant count\`);[0m
[38;2;131;148;150m 307[0m [38;2;248;248;242mconsole.log(\`   GET /api/health - Health check\`);[0m
