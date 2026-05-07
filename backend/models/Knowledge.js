const db = require('../config/database');

class Knowledge {
    static findAll({ module, search } = {}) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM knowledge_points WHERE 1=1';
            const params = [];
            if (module) { sql += ' AND module = ?'; params.push(module); }
            if (search) { sql += ' AND (title LIKE ? OR content LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
            sql += ' ORDER BY order_index, id';
            db.all(sql, params, (err, rows) => { err ? reject(err) : resolve(rows); });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM knowledge_points WHERE id = ?', [id], (err, row) => {
                err ? reject(err) : resolve(row);
            });
        });
    }

    static getModules() {
        return new Promise((resolve, reject) => {
            db.all('SELECT DISTINCT module FROM knowledge_points ORDER BY module', [], (err, rows) => {
                err ? reject(err) : resolve(rows.map(r => r.module));
            });
        });
    }
}

module.exports = Knowledge;
