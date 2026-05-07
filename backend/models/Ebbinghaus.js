const db = require('../config/database');

const STAGES = [1, 2, 4, 7, 15, 30];

class Ebbinghaus {
    static generateRecords(userId, itemType, itemId) {
        const now = new Date();
        const stmt = db.prepare(`INSERT OR IGNORE INTO ebbinghaus_records
          (user_id, item_type, item_id, stage, scheduled_at, status)
          VALUES (?, ?, ?, ?, ?, 'pending')`);
        STAGES.forEach((days, i) => {
            const d = new Date(now);
            d.setDate(d.getDate() + days);
            stmt.run(userId, itemType, itemId, i + 1, d.toISOString().split('T')[0]);
        });
        stmt.finalize();
    }

    static getTodayReviews(userId) {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0];
            db.all(`SELECT er.*,
                CASE WHEN er.item_type = 'word' THEN w.word ELSE kp.title END as title,
                CASE WHEN er.item_type = 'word' THEN w.meaning ELSE kp.content END as content,
                CASE WHEN er.item_type = 'word' THEN w.phonetic ELSE '' END as phonetic,
                CASE WHEN er.item_type = 'word' THEN w.example ELSE '' END as example_text
              FROM ebbinghaus_records er
              LEFT JOIN words w ON er.item_type = 'word' AND w.id = er.item_id
              LEFT JOIN knowledge_points kp ON er.item_type = 'knowledge' AND kp.id = er.item_id
              WHERE er.user_id = ? AND er.status = 'pending' AND er.scheduled_at <= ?
              ORDER BY er.scheduled_at`, [userId, today], (err, rows) => {
                err ? reject(err) : resolve(rows);
            });
        });
    }

    static getCalendar(userId, days = 30) {
        return new Promise((resolve, reject) => {
            const end = new Date();
            end.setDate(end.getDate() + days);
            db.all(`SELECT scheduled_at, COUNT(*) as count
              FROM ebbinghaus_records
              WHERE user_id = ? AND status = 'pending'
                AND scheduled_at BETWEEN ? AND ?
              GROUP BY scheduled_at ORDER BY scheduled_at`,
                [userId, new Date().toISOString().split('T')[0], end.toISOString().split('T')[0]],
                (err, rows) => { err ? reject(err) : resolve(rows); });
        });
    }

    static reviewItem(userId, itemType, itemId, stage, mastered) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            if (mastered) {
                db.run(`UPDATE ebbinghaus_records SET status = 'done', reviewed_at = ?
                  WHERE user_id = ? AND item_type = ? AND item_id = ? AND stage = ?`,
                    [now, userId, itemType, itemId, stage],
                    function (err) { err ? reject(err) : resolve({ changes: this.changes }); });
            } else {
                const itemTable = itemType === 'word' ? 'user_words' : 'user_knowledge';
                const itemCol = itemType === 'word' ? 'word_id' : 'knowledge_id';
                db.run(`UPDATE ${itemTable} SET status = 'unmastered' WHERE user_id = ? AND ${itemCol} = ?`,
                    [userId, itemId]);
                db.run(`UPDATE ebbinghaus_records SET status = 'skipped'
                  WHERE user_id = ? AND item_type = ? AND item_id = ? AND status = 'pending'`,
                    [userId, itemType, itemId],
                    function (err) { err ? reject(err) : resolve({ changes: this.changes }); });
            }
        });
    }
}

module.exports = Ebbinghaus;
