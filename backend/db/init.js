const Database = require('better-sqlite3');
const path = require('path');

// Use absolute path for database file
const dbPath = path.join(__dirname, 'portfolio.db');

try {
    const db = new Database(dbPath, { 
        verbose: console.log,  // Helps with debugging
        fileMustExist: false  // Creates db if it doesn't exist
    });

    // Initialize tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            duration INTEGER NOT NULL,
            topic TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    module.exports = db;
} catch (error) {
    console.error('Database initialization error:', error);
    console.error('Database path:', dbPath);
    process.exit(1);
} 