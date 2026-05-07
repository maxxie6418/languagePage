const db = require('../config/database');

class User {
    static create(username, passwordHash, role = 'user') {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
            db.run(sql, [username, passwordHash, role], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, username, role });
                }
            });
        });
    }

    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, username, role, ebbinghaus_reminder_enabled, created_at FROM users WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static count() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM users';
            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    static updateReminderSetting(userId, enabled) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET ebbinghaus_reminder_enabled = ? WHERE id = ?';
            db.run(sql, [enabled ? 1 : 0, userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }
}

module.exports = User;
