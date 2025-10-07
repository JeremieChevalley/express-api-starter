// config/database.js (productItem-service)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'productItems.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

db.run('PRAGMA foreign_keys = ON;');

const initSql = `
CREATE TABLE IF NOT EXISTS productItems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
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

    db.get('SELECT COUNT(*) AS count FROM productItems', (err, row) => {
        if (err) {
            console.error('Error checking item count', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding productItems...');

            const seedData = [
                ['Champignons', 1.00],
                ['Oignons', 1.00],
                ['Câpres', 1.00],
                ['Oeuf', 1.00],
                ['Poivrons', 1.00],
                ['Artichauts', 1.00],
                ['Crème', 1.00],
                ['Ananas', 1.00],
                ['Pecorino romano', 1.00],
                ['Jambon', 2.00],
                ['Lardons', 2.00],
                ['Salami piquant', 2.00],
                ['Gorgonzola', 2.00],
                ['Chèvre', 2.00],
                ['Anchois', 2.00],
                ['Racelette', 2.00],
                ['Tomme vaudoise', 2.00],
                ['Thon', 2.00],
                ['Mozzarella', 2.00]
            ];

            const insertSql = `INSERT INTO productItems (name, price) VALUES (?, ?)`;
            const stmt = db.prepare(insertSql);

            seedData.forEach(([name, price]) => stmt.run(name, price));
            stmt.finalize(() => console.log('Seeded productItems.'));
        }
    });
});

module.exports = db;
