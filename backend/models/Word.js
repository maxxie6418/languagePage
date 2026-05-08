const db = require('../config/database');

class Word {
    static async findAll({ search, category, page = 1, limit = 100 } = {}) {
        let sql = 'SELECT * FROM words WHERE 1=1';
        const params = [];
        let idx = 1;
        if (search) { sql += ` AND (word LIKE $${idx++} OR meaning LIKE $${idx++})`; params.push(`%${search}%`, `%${search}%`); }
        if (category) { sql += ` AND category = $${idx++}`; params.push(category); }
        sql += ` ORDER BY order_index, id LIMIT $${idx++} OFFSET $${idx++}`;
        params.push(limit, (page - 1) * limit);
        const result = await db.query(sql, params);
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM words WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async count({ search, category } = {}) {
        let sql = 'SELECT COUNT(*) as count FROM words WHERE 1=1';
        const params = [];
        let idx = 1;
        if (search) { sql += ` AND (word LIKE $${idx++} OR meaning LIKE $${idx++})`; params.push(`%${search}%`, `%${search}%`); }
        if (category) { sql += ` AND category = $${idx++}`; params.push(category); }
        const result = await db.query(sql, params);
        return result.rows[0].count;
    }

    static async getCategories() {
        const result = await db.query('SELECT DISTINCT category FROM words WHERE category IS NOT NULL ORDER BY category', []);
        return result.rows.map(r => r.category);
    }
}

module.exports = Word;
