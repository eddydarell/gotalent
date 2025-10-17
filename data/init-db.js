import { Database } from "bun:sqlite";
import { readFileSync } from "fs";

const dbPath = "/data/gotalent.db";
const sqlPath = "/init-db.sql";

try {
  console.log("Initializing database...");
  
  // Read SQL file
  const sql = readFileSync(sqlPath, "utf-8");
  
  // Create database and execute SQL as a single batch
  const db = new Database(dbPath);
  
  // Execute the entire SQL script at once
  db.exec(sql);
  
  db.close();
  
  console.log("Database initialized successfully!");
  console.log(`Created database at: ${dbPath}`);
  
} catch (error) {
  console.error("Error initializing database:", error);
  process.exit(1);
}
