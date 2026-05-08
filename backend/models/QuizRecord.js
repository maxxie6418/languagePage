const db = require('../config/database');

class QuizRecord {
    static async create(userId, quizType, category, score, total, answers) {
        const sql = `INSERT INTO quiz_records (user_id, quiz_type, category, score, total, answers)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const result = await db.query(sql, [userId, quizType, category, score, total, JSON.stringify(answers)]);
        return { id: result.rows[0].id };
    }

    static async findByUser(userId, limit = 20) {
        const result = await db.query('SELECT * FROM quiz_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
            [userId, limit]);
        return result.rows;
    }

    static async addMistake(userId, questionId, category) {
        const now = new Date().toISOString();
        const sql = `INSERT INTO mistakes (user_id, question_id, category, wrong_count, last_wrong_at)
              VALUES ($1, $2, $3, 1, $4)
              ON CONFLICT(user_id, question_id) DO UPDATE SET
                wrong_count = wrong_count + 1,
                last_wrong_at = $5`;
        const result = await db.query(sql, [userId, questionId, category, now, now]);
        return { changes: result.rowCount };
    }

    static async getMistakes(userId, category) {
        let sql = `SELECT m.*, q.category as q_category, q.question_text, q.options, q.answer, q.explanation
              FROM mistakes m JOIN questions q ON m.question_id = q.id
              WHERE m.user_id = $1`;
        const params = [userId];
        let idx = 2;
        if (category && category !== '全部题型') { sql += ` AND m.category = $${idx++}`; params.push(category); }
        sql += ' ORDER BY m.wrong_count DESC, m.last_wrong_at DESC';
        const result = await db.query(sql, params);
        return result.rows;
    }

    static async clearMistake(userId, questionId) {
        const result = await db.query('DELETE FROM mistakes WHERE user_id = $1 AND question_id = $2',
            [userId, questionId]);
        return { changes: result.rowCount };
    }
}

module.exports = QuizRecord;
