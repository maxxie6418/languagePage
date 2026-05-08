const db = require('../config/database');

class Knowledge {
    static async findAll({ module, search } = {}) {
        let sql = 'SELECT * FROM knowledge_points WHERE 1=1';
        const params = [];
        let idx = 1;
        if (module) { sql += ` AND module = $${idx++}`; params.push(module); }
        if (search) { sql += ` AND (title LIKE $${idx++} OR content LIKE $${idx++})`; params.push(`%${search}%`, `%${search}%`); }
        sql += ' ORDER BY order_index, id';
        const result = await db.query(sql, params);
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM knowledge_points WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async getModules() {
        const result = await db.query('SELECT DISTINCT module FROM knowledge_points ORDER BY module', []);
        return result.rows.map(r => r.module);
    }
}

module.exports = Knowledge;
