const db = require('../config/database');

class Question {
    static findByCategory(category, limit = 10) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM questions WHERE category = ? ORDER BY RANDOM() LIMIT ?`,
                [category, limit], (err, rows) => { err ? reject(err) : resolve(rows); });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM questions WHERE id = ?', [id], (err, row) => {
                err ? reject(err) : resolve(row);
            });
        });
    }

    static randomByCategory(category, limit = 5) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM questions';
            const params = [];
            if (category) { sql += ' WHERE category = ?'; params.push(category); }
            sql += ' ORDER BY RANDOM() LIMIT ?';
            params.push(limit);
            db.all(sql, params, (err, rows) => { err ? reject(err) : resolve(rows); });
        });
    }

    static getCategories() {
        return new Promise((resolve, reject) => {
            db.all('SELECT DISTINCT category FROM questions ORDER BY category', [], (err, rows) => {
                err ? reject(err) : resolve(rows.map(r => r.category));
            });
        });
    }
}

module.exports = Question;
