const db = require('../config/database');

class QuizRecord {
    static create(userId, quizType, category, score, total, answers) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO quiz_records (user_id, quiz_type, category, score, total, answers)
              VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, quizType, category, score, total, JSON.stringify(answers)],
                function (err) { err ? reject(err) : resolve({ id: this.lastID }); });
        });
    }

    static findByUser(userId, limit = 20) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM quiz_records WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
                [userId, limit], (err, rows) => { err ? reject(err) : resolve(rows); });
        });
    }

    static addMistake(userId, questionId, category) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO mistakes (user_id, question_id, category, wrong_count, last_wrong_at)
              VALUES (?, ?, ?, 1, ?)
              ON CONFLICT(user_id, question_id) DO UPDATE SET
                wrong_count = wrong_count + 1,
                last_wrong_at = ?`,
                [userId, questionId, category, new Date().toISOString(), new Date().toISOString()],
                function (err) { err ? reject(err) : resolve({ changes: this.changes }); });
        });
    }

    static getMistakes(userId, category) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT m.*, q.category as q_category, q.question_text, q.options, q.answer, q.explanation
              FROM mistakes m JOIN questions q ON m.question_id = q.id
              WHERE m.user_id = ?`;
            const params = [userId];
            if (category && category !== '全部题型') { sql += ' AND m.category = ?'; params.push(category); }
            sql += ' ORDER BY m.wrong_count DESC, m.last_wrong_at DESC';
            db.all(sql, params, (err, rows) => { err ? reject(err) : resolve(rows); });
        });
    }

    static clearMistake(userId, questionId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM mistakes WHERE user_id = ? AND question_id = ?',
                [userId, questionId], function (err) { err ? reject(err) : resolve({ changes: this.changes }); });
        });
    }
}

module.exports = QuizRecord;
