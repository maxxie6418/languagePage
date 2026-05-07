const db = require('../config/database');

class UserKnowledge {
    static findByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM user_knowledge WHERE user_id = ?', [userId], (err, rows) => {
                err ? reject(err) : resolve(rows);
            });
        });
    }

    static upsertStatus(userId, knowledgeId, status) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            db.run(`INSERT INTO user_knowledge (user_id, knowledge_id, status, mastered_at)
                     VALUES (?, ?, ?, ?)
                     ON CONFLICT(user_id, knowledge_id) DO UPDATE SET
                       status = excluded.status,
                       mastered_at = CASE WHEN excluded.status = 'mastered' THEN ? ELSE NULL END`,
                [userId, knowledgeId, status, status === 'mastered' ? now : null, status === 'mastered' ? now : null],
                function (err) { err ? reject(err) : resolve({ changes: this.changes }); });
        });
    }

    static getStats(userId) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as mastered
              FROM (
                SELECT kp.id, uk.status FROM knowledge_points kp
                LEFT JOIN user_knowledge uk ON kp.id = uk.knowledge_id AND uk.user_id = ?
              )`, [userId], (err, row) => {
                err ? reject(err) : resolve(row || { total: 0, mastered: 0 });
            });
        });
    }
}

module.exports = UserKnowledge;
