const db = require('../config/database');

class User {
    static async create(username, passwordHash, role = 'user') {
        const sql = 'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id';
        const result = await db.query(sql, [username, passwordHash, role]);
        const id = result.rows[0].id;
        return { id, username, role };
    }

    static async findByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = $1';
        const result = await db.query(sql, [username]);
        return result.rows[0];
    }

    static async findById(id) {
        const sql = 'SELECT id, username, role, ebbinghaus_reminder_enabled, created_at FROM users WHERE id = $1';
        const result = await db.query(sql, [id]);
        return result.rows[0];
    }

    static async count() {
        const sql = 'SELECT COUNT(*) as count FROM users';
        const result = await db.query(sql, []);
        return result.rows[0].count;
    }

    static async updateReminderSetting(userId, enabled) {
        const sql = 'UPDATE users SET ebbinghaus_reminder_enabled = $1 WHERE id = $2';
        const result = await db.query(sql, [enabled ? 1 : 0, userId]);
        return { changes: result.rowCount };
    }
}

module.exports = User;
