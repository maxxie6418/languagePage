const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/learning.db');
const fs = require('fs');

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('数据库连接失败:', err.message);
    } else {
        console.log('成功连接到SQLite数据库');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            ebbinghaus_reminder_enabled INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            phonetic TEXT,
            meaning TEXT NOT NULL,
            example TEXT,
            category TEXT,
            order_index INTEGER DEFAULT 0
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS user_words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            word_id INTEGER NOT NULL,
            status TEXT DEFAULT 'unmastered',
            mastered_at DATETIME,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, word_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS knowledge_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            module TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            order_index INTEGER DEFAULT 0
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS user_knowledge (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            knowledge_id INTEGER NOT NULL,
            status TEXT DEFAULT 'unmastered',
            mastered_at DATETIME,
            UNIQUE(user_id, knowledge_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS ebbinghaus_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            item_type TEXT NOT NULL,
            item_id INTEGER NOT NULL,
            stage INTEGER NOT NULL,
            scheduled_at DATETIME NOT NULL,
            reviewed_at DATETIME,
            status TEXT DEFAULT 'pending',
            UNIQUE(user_id, item_type, item_id, stage),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            source TEXT,
            passage TEXT,
            question_text TEXT NOT NULL,
            options TEXT,
            answer TEXT NOT NULL,
            explanation TEXT,
            keywords TEXT,
            difficulty TEXT DEFAULT 'medium',
            order_index INTEGER DEFAULT 0
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS quiz_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            quiz_type TEXT NOT NULL,
            category TEXT,
            score INTEGER,
            total INTEGER,
            answers TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS mistakes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            category TEXT,
            wrong_count INTEGER DEFAULT 1,
            last_wrong_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, question_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS ai_configs (
            id INTEGER PRIMARY KEY,
            provider TEXT DEFAULT 'deepseek',
            api_key TEXT,
            base_url TEXT,
            model TEXT DEFAULT 'deepseek-chat',
            is_enabled INTEGER DEFAULT 0
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS question_sets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            category TEXT,
            time_limit INTEGER,
            description TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS question_set_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            set_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            order_index INTEGER DEFAULT 0,
            UNIQUE(set_id, question_id),
            FOREIGN KEY (set_id) REFERENCES question_sets(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS user_word_lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS user_word_list_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER NOT NULL,
            word_id INTEGER NOT NULL,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            note TEXT,
            UNIQUE(list_id, word_id),
            FOREIGN KEY (list_id) REFERENCES user_word_lists(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS user_word_flags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            word_id INTEGER NOT NULL,
            flag_type TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, word_id, flag_type),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        db.run(`INSERT OR IGNORE INTO ai_configs (id, provider, model, is_enabled) 
                 VALUES (1, 'deepseek', 'deepseek-chat', 0)`);

        console.log('数据库表创建成功！');
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('数据库连接已关闭');
        });
    });
}
