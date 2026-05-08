const db = require('../config/database');

class Question {
    static async findByCategory(category, limit = 10) {
        const result = await db.query(`SELECT * FROM questions WHERE category = $1 ORDER BY RANDOM() LIMIT $2`,
            [category, limit]);
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM questions WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async randomByCategory(category, limit = 5) {
        let sql = 'SELECT * FROM questions';
        const params = [];
        let idx = 1;
        if (category) { sql += ` WHERE category = $${idx++}`; params.push(category); }
        sql += ` ORDER BY RANDOM() LIMIT $${idx++}`;
        params.push(limit);
        const result = await db.query(sql, params);
        return result.rows;
    }

    static async getCategories() {
        const result = await db.query('SELECT DISTINCT category FROM questions ORDER BY category', []);
        return result.rows.map(r => r.category);
    }
}

module.exports = Question;
