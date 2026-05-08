const db = require('../config/database');

const STAGES = [1, 2, 4, 7, 15, 30];

class Ebbinghaus {
    static async generateRecords(userId, itemType, itemId) {
        const now = new Date();
        const sql = `INSERT INTO ebbinghaus_records
          (user_id, item_type, item_id, stage, scheduled_at, status)
          VALUES ($1, $2, $3, $4, $5, 'pending')
          ON CONFLICT DO NOTHING`;
        for (let i = 0; i < STAGES.length; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() + STAGES[i]);
            await db.query(sql, [userId, itemType, itemId, i + 1, d.toISOString().split('T')[0]]);
        }
    }

    static async getTodayReviews(userId) {
        const today = new Date().toISOString().split('T')[0];
        const sql = `SELECT er.*,
                CASE WHEN er.item_type = 'word' THEN w.word ELSE kp.title END as title,
                CASE WHEN er.item_type = 'word' THEN w.meaning ELSE kp.content END as content,
                CASE WHEN er.item_type = 'word' THEN w.phonetic ELSE '' END as phonetic,
                CASE WHEN er.item_type = 'word' THEN w.example ELSE '' END as example_text
              FROM ebbinghaus_records er
              LEFT JOIN words w ON er.item_type = 'word' AND w.id = er.item_id
              LEFT JOIN knowledge_points kp ON er.item_type = 'knowledge' AND kp.id = er.item_id
              WHERE er.user_id = $1 AND er.status = 'pending' AND er.scheduled_at <= $2
              ORDER BY er.scheduled_at`;
        const result = await db.query(sql, [userId, today]);
        return result.rows;
    }

    static async getCalendar(userId, days = 30) {
        const end = new Date();
        end.setDate(end.getDate() + days);
        const sql = `SELECT scheduled_at, COUNT(*) as count
              FROM ebbinghaus_records
              WHERE user_id = $1 AND status = 'pending'
                AND scheduled_at BETWEEN $2 AND $3
              GROUP BY scheduled_at ORDER BY scheduled_at`;
        const result = await db.query(sql, [userId, new Date().toISOString().split('T')[0], end.toISOString().split('T')[0]]);
        return result.rows;
    }

    static async reviewItem(userId, itemType, itemId, stage, mastered) {
        const now = new Date().toISOString();
        if (mastered) {
            const sql = `UPDATE ebbinghaus_records SET status = 'done', reviewed_at = $1
                  WHERE user_id = $2 AND item_type = $3 AND item_id = $4 AND stage = $5`;
            const result = await db.query(sql, [now, userId, itemType, itemId, stage]);
            return { changes: result.rowCount };
        } else {
            const itemTable = itemType === 'word' ? 'user_words' : 'user_knowledge';
            const itemCol = itemType === 'word' ? 'word_id' : 'knowledge_id';
            await db.query(`UPDATE ${itemTable} SET status = 'unmastered' WHERE user_id = $1 AND ${itemCol} = $2`,
                [userId, itemId]);
            const sql = `UPDATE ebbinghaus_records SET status = 'skipped'
                  WHERE user_id = $1 AND item_type = $2 AND item_id = $3 AND status = 'pending'`;
            const result = await db.query(sql, [userId, itemType, itemId]);
            return { changes: result.rowCount };
        }
    }
}

module.exports = Ebbinghaus;
