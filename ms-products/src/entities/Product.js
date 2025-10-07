// src/entities/Product.js
const db = require('../config/database');

const Product = {
    findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM products', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    insert(product) {
        const { name, price } = product;
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO products (name, price) VALUES (?, ?)`,
                [name, price],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...product });
                }
            );
        });
    },

    update(id, product) {
        const { name, price } = product;
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE products SET name = ?, price = ?, updated_at = datetime('now') WHERE id = ?`,
                [name, price, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...product });
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM products WHERE id = ?',
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0); // true if a row was deleted
                }
            );
        });
    },

    findCompositions(productId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM product_compositions WHERE product_id = ?',
                [productId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    insertComposition(productId, itemId) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO product_compositions (product_id, item_id)
         VALUES (?, ?, ?, ?)`,
                [productId, itemId],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, productId, itemId});
                }
            );
        });
    },

    deleteCompositions(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM product_compositions WHERE id = ?',
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0); // true if a row was deleted
                }
            );
        });
    },
};

module.exports = Product;
