const db = require('../config/database');

class UserWord {
    static async findByUser(userId) {
        const result = await db.query('SELECT * FROM user_words WHERE user_id = $1', [userId]);
        return result.rows;
    }

    static async upsertStatus(userId, wordId, status) {
        const now = new Date().toISOString();
        const masteredAt = status === 'mastered' ? now : null;
        const sql = `INSERT INTO user_words (user_id, word_id, status, mastered_at, updated_at)
                     VALUES ($1, $2, $3, $4, $5)
                     ON CONFLICT(user_id, word_id) DO UPDATE SET
                       status = excluded.status,
                       mastered_at = CASE WHEN excluded.status = 'mastered' THEN $6 ELSE NULL END,
                       updated_at = excluded.updated_at`;
        const result = await db.query(sql, [userId, wordId, status, masteredAt, now, masteredAt, now]);
        return { changes: result.rowCount };
    }

    static batchUpdateStatus(userId, wordIds, status) {
        return Promise.all(wordIds.map(id => this.upsertStatus(userId, id, status)));
    }

    static async getStats(userId) {
        const sql = `SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as mastered,
                SUM(CASE WHEN status = 'learning' THEN 1 ELSE 0 END) as learning,
                SUM(CASE WHEN status = 'unmastered' OR status IS NULL THEN 1 ELSE 0 END) as unmastered
              FROM (
                SELECT w.id, uw.status FROM words w
                LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = $1
              )`;
        const result = await db.query(sql, [userId]);
        return result.rows[0] || { total: 0, mastered: 0, learning: 0, unmastered: 0 };
    }
}

module.exports = UserWord;
