// config/database.js (product-service)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'products.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Enable foreign key enforcement for local integrity (only within this DB)
db.run('PRAGMA foreign_keys = ON;');

// Create tables
const initSql = `
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- No real FK to productItems here (it’s managed by API validation)
CREATE TABLE IF NOT EXISTS product_compositions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
`;

db.serialize(() => {
    db.exec(initSql, (err) => {
        if (err) {
            console.error('Failed to initialize database', err);
            process.exit(1);
        }
        console.log('Tables ensured.');
    });

    // Seed products only if empty
    db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
        if (err) {
            console.error('Error checking product count', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding test data (products)...');

            const productData = [
                ['Margherita', 13.0],
                ['Romana', 15.0],
            ];

            const insertProductSql = `INSERT INTO products (name, price)
                                VALUES (?, ?)`;
            const productStmt = db.prepare(insertProductSql);

            productData.forEach(([name, price]) =>
                productStmt.run(name, price)
            );

            productStmt.finalize(() => console.log('Seed data inserted.'));
        } else {
            console.log(`Database already contains ${row.count} products — skipping seed.`);
        }
    });

    // Seed compositions only if empty
    db.get('SELECT COUNT(*) AS count FROM product_compositions', (err, row) => {
        if (err) {
            console.error('Error checking product_compositions', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding product_compositions...');
            const stmt = db.prepare(`
            INSERT INTO product_compositions (product_id, item_id)
            VALUES (?, ?)
        `);

            stmt.run(1, 1);
            stmt.run(1, 2);

            stmt.run(2, 1);
            stmt.run(2, 2);
            stmt.run(2, 3);

            stmt.finalize(() => console.log('product_compositions seeded.'));
        }
    });
});

module.exports = db;
