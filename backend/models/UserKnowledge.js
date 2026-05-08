const db = require('../config/database');

class UserKnowledge {
    static async findByUser(userId) {
        const result = await db.query('SELECT * FROM user_knowledge WHERE user_id = $1', [userId]);
        return result.rows;
    }

    static async upsertStatus(userId, knowledgeId, status) {
        const now = new Date().toISOString();
        const masteredAt = status === 'mastered' ? now : null;
        const sql = `INSERT INTO user_knowledge (user_id, knowledge_id, status, mastered_at)
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT(user_id, knowledge_id) DO UPDATE SET
                       status = excluded.status,
                       mastered_at = CASE WHEN excluded.status = 'mastered' THEN $5 ELSE NULL END`;
        const result = await db.query(sql, [userId, knowledgeId, status, masteredAt, masteredAt]);
        return { changes: result.rowCount };
    }

    static async getStats(userId) {
        const sql = `SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as mastered
              FROM (
                SELECT kp.id, uk.status FROM knowledge_points kp
                LEFT JOIN user_knowledge uk ON kp.id = uk.knowledge_id AND uk.user_id = $1
              )`;
        const result = await db.query(sql, [userId]);
        return result.rows[0] || { total: 0, mastered: 0 };
    }
}

module.exports = UserKnowledge;
