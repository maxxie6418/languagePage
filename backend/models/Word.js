const db = require('../config/database');

class Word {
    static findAll({ search, category, page = 1, limit = 100 } = {}) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM words WHERE 1=1';
            const params = [];
            if (search) { sql += ' AND (word LIKE ? OR meaning LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
            if (category) { sql += ' AND category = ?'; params.push(category); }
            sql += ' ORDER BY order_index, id LIMIT ? OFFSET ?';
            params.push(limit, (page - 1) * limit);
            db.all(sql, params, (err, rows) => { err ? reject(err) : resolve(rows); });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM words WHERE id = ?', [id], (err, row) => { err ? reject(err) : resolve(row); });
        });
    }

    static count({ search, category } = {}) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT COUNT(*) as count FROM words WHERE 1=1';
            const params = [];
            if (search) { sql += ' AND (word LIKE ? OR meaning LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
            if (category) { sql += ' AND category = ?'; params.push(category); }
            db.get(sql, params, (err, row) => { err ? reject(err) : resolve(row.count); });
        });
    }

    static getCategories() {
        return new Promise((resolve, reject) => {
            db.all('SELECT DISTINCT category FROM words WHERE category IS NOT NULL ORDER BY category', [], (err, rows) => {
                err ? reject(err) : resolve(rows.map(r => r.category));
            });
        });
    }
}

module.exports = Word;
