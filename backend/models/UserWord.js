const db = require('../config/database');

class UserWord {
    static findByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM user_words WHERE user_id = ?', [userId], (err, rows) => {
                err ? reject(err) : resolve(rows);
            });
        });
    }

    static upsertStatus(userId, wordId, status) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            db.run(`INSERT INTO user_words (user_id, word_id, status, mastered_at, updated_at)
                     VALUES (?, ?, ?, ?, ?)
                     ON CONFLICT(user_id, word_id) DO UPDATE SET
                       status = excluded.status,
                       mastered_at = CASE WHEN excluded.status = 'mastered' THEN ? ELSE NULL END,
                       updated_at = excluded.updated_at`,
                [userId, wordId, status, status === 'mastered' ? now : null, now, status === 'mastered' ? now : null, now],
                function (err) { err ? reject(err) : resolve({ changes: this.changes }); });
        });
    }

    static batchUpdateStatus(userId, wordIds, status) {
        return Promise.all(wordIds.map(id => this.upsertStatus(userId, id, status)));
    }

    static getStats(userId) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as mastered,
                SUM(CASE WHEN status = 'learning' THEN 1 ELSE 0 END) as learning,
                SUM(CASE WHEN status = 'unmastered' OR status IS NULL THEN 1 ELSE 0 END) as unmastered
              FROM (
                SELECT w.id, uw.status FROM words w
                LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = ?
              )`, [userId], (err, row) => {
                err ? reject(err) : resolve(row || { total: 0, mastered: 0, learning: 0, unmastered: 0 });
            });
        });
    }
}

module.exports = UserWord;
