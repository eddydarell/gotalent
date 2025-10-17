const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, 'data', 'participants.db');

console.log('Connecting to database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Get table schema
db.serialize(() => {
    // Get all table names
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error('Error getting tables:', err.message);
            return;
        }
        
        console.log('\n=== Database Tables ===');
        tables.forEach(table => {
            console.log(`- ${table.name}`);
        });
        
        // Get schema for each table
        tables.forEach(table => {
            console.log(`\n=== Schema for table: ${table.name} ===`);
            db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
                if (err) {
                    console.error(`Error getting schema for ${table.name}:`, err.message);
                    return;
                }
                
                columns.forEach(col => {
                    console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
                });
                
                // Get sample data (first 3 rows)
                console.log(`\n=== Sample data from ${table.name} ===`);
                db.all(`SELECT * FROM ${table.name} LIMIT 3`, [], (err, rows) => {
                    if (err) {
                        console.error(`Error getting sample data from ${table.name}:`, err.message);
                        return;
                    }
                    
                    console.log(JSON.stringify(rows, null, 2));
                    
                    // Close database after processing all tables
                    if (table === tables[tables.length - 1]) {
                        db.close((err) => {
                            if (err) {
                                console.error('Error closing database:', err.message);
                            } else {
                                console.log('\nDatabase connection closed.');
                            }
                        });
                    }
                });
            });
        });
    });
});
