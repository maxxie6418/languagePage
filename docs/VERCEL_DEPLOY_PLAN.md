# 考研英语学习站 - Vercel + Supabase 部署改造计划

## 概述
将本地 Express + SQLite 项目改造为 Vercel Serverless + Supabase PostgreSQL 部署。

---

## 阶段一：数据库迁移（Supabase）

| 序号 | 任务 | 详细说明 | 预计时间 |
|:---:|---|---|:---:|
| 1.1 | 注册 Supabase | 访问 https://supabase.com，使用 GitHub 账号登录，创建新项目 | 10分钟 |
| 1.2 | 获取连接信息 | Project Settings → Database → Connection string → URI 格式，复制 `DATABASE_URL` | 5分钟 |
| 1.3 | 创建表结构 | 在 SQL Editor 执行改造后的 PostgreSQL 建表语句（见下方 SQL 对照） | 30分钟 |
| 1.4 | 导入现有数据 | 从 `data/learning.db` 导出数据为 JSON/CSV，使用 Supabase Table Editor 导入 | 30分钟 |
| 1.5 | 测试连接 | 本地创建测试脚本，使用 `pg` 库连接 Supabase 验证 | 15分钟 |

---

## 阶段二：后端改造（Node.js → Vercel Serverless）

| 序号 | 任务 | 详细说明 | 预计时间 |
|:---:|---|---|:---:|
| 2.1 | 安装依赖 | `npm install pg @vercel/node` | 5分钟 |
| 2.2 | 改造 `database.js` | 重写为 PostgreSQL 连接池，使用 `DATABASE_URL` 环境变量 | 30分钟 |
| 2.3 | 改造所有 Models | 调整 SQL 语法：`?` → `$1`，`last_insert_rowid()` → `RETURNING id` | 60分钟 |
| 2.4 | 改造 `server.js` | Express 改为 Vercel Serverless 格式，导出 handler 函数 | 45分钟 |
| 2.5 | 创建 `vercel.json` | 配置 API 路由和静态文件服务 | 20分钟 |
| 2.6 | 环境变量配置 | 更新 `.env` 和 `.env.example`，添加 `DATABASE_URL` | 10分钟 |

---

## 阶段三：前端调整

| 序号 | 任务 | 详细说明 | 预计时间 |
|:---:|---|---|:---:|
| 3.1 | API 地址配置 | `public/index.html` 中所有 API 调用改为相对路径 `/api/` | 20分钟 |
| 3.2 | 构建配置 | 确保前端资源正确打包，配置 Vercel 静态文件服务 | 15分钟 |

---

## 阶段四：部署配置

| 序号 | 任务 | 详细说明 | 预计时间 |
|:---:|---|---|:---:|
| 4.1 | 安装 Vercel CLI | `npm i -g vercel` | 5分钟 |
| 4.2 | Vercel 登录 | `vercel login` | 5分钟 |
| 4.3 | 初始化项目 | `vercel`（按提示配置） | 10分钟 |
| 4.4 | 配置环境变量 | Vercel Dashboard → Project Settings → Environment Variables → 添加 `DATABASE_URL` | 10分钟 |
| 4.5 | 生产部署 | `vercel --prod` | 5分钟 |
| 4.6 | 功能验证 | 测试：注册/登录/单词列表/学习进度/艾宾浩斯/AI 答疑 | 30分钟 |

---

## 阶段五：清理与文档

| 序号 | 任务 | 详细说明 | 预计时间 |
|:---:|---|---|:---:|
| 5.1 | 删除 SQLite 代码 | 移除 `sqlite3` 依赖，删除 `data/` 目录 | 10分钟 |
| 5.2 | 更新 package.json | 移除 `init-db`/`seed-db` scripts，更新 description | 10分钟 |
| 5.3 | 更新 README | 添加部署说明、环境变量配置、在线访问地址 | 20分钟 |
| 5.4 | 更新启动脚本 | `开始.bat`/`start.bat` 改为本地开发专用，或添加部署命令 | 15分钟 |

---

## 关键文件清单

### 高优先级（必须修改）

| 文件路径 | 操作 | 改动要点 |
|---|---|---|
| `backend/config/database.js` | 重写 | SQLite → PostgreSQL，使用 `pg` 连接池 |
| `backend/models/Word.js` | 调整 | SQL 占位符和语法 |
| `backend/models/User.js` | 调整 | SQL 占位符和语法 |
| `backend/models/Ebbinghaus.js` | 调整 | SQL 占位符和语法 |
| `backend/models/Knowledge.js` | 调整 | SQL 占位符和语法 |
| `backend/models/QuizRecord.js` | 调整 | SQL 占位符和语法 |
| `backend/models/Question.js` | 调整 | SQL 占位符和语法 |
| `backend/models/UserWord.js` | 调整 | SQL 占位符和语法 |
| `backend/models/UserKnowledge.js` | 调整 | SQL 占位符和语法 |
| `backend/server.js` | 重写 | 改为 Vercel Serverless handler 格式 |
| `package.json` | 修改 | 添加 `pg`，移除 `sqlite3`，更新 scripts |
| `vercel.json` | 新建 | API 路由和静态资源配置 |

### 中优先级（需要调整）

| 文件路径 | 操作 | 改动要点 |
|---|---|---|
| `.env` | 更新 | 添加 `DATABASE_URL`，移除 SQLite 路径 |
| `.env.example` | 更新 | 添加 `DATABASE_URL` 模板 |
| `public/index.html` | 修改 | API 地址改为相对路径 `/api/` |

### 低优先级（可选）

| 文件路径 | 操作 | 改动要点 |
|---|---|---|
| `开始.bat` | 更新 | 改为本地开发启动 |
| `start.bat` | 更新 | 改为本地开发启动 |
| `start.ps1` | 更新 | 改为本地开发启动 |
| `README.md` | 更新 | 添加部署文档 |

---

## SQL 语法对照表

### 数据类型

| SQLite | PostgreSQL | 说明 |
|---|---|---|
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` | 自增主键 |
| `INTEGER` | `INTEGER` | 整数 |
| `TEXT` | `TEXT` | 文本 |
| `DATETIME DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT NOW()` | 时间戳 |

### 查询语法

| SQLite | PostgreSQL | 说明 |
|---|---|---|
| `?` | `$1, $2, $3...` | 参数占位符 |
| `INSERT ...; SELECT last_insert_rowid()` | `INSERT ... RETURNING id` | 获取插入 ID |
| `LIMIT ? OFFSET ?` | `LIMIT $1 OFFSET $2` | 分页 |

---

## 参考代码

### database.js（改造后）

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
```

### server.js（改造后）

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 路由配置
app.use('/api/auth', require('./routes/auth'));
app.use('/api/words', require('./routes/words'));
// ... 其他路由

// Vercel Serverless 导出
module.exports = app;
```

### vercel.json（新建）

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
```

---

## 部署后访问

| 环境 | 命令/地址 |
|---|---|
| 本地开发 | `npm run dev` → http://localhost:3000 |
| 预览部署 | `vercel` → https://xxx.vercel.app |
| 生产部署 | `vercel --prod` → https://your-project.vercel.app |

---

## 常见问题

### Q: Supabase 免费额度够用吗？
A: 免费版包含 500MB 数据库 + 2GB 带宽，对于个人学习项目完全够用。

### Q: 需要改前端框架吗？
A: 不需要，保持现有的原生 HTML/CSS/JS 即可。

### Q: AI 功能还能用吗？
A: 可以，DeepSeek API 调用不受影响，只需确保环境变量配置正确。

### Q: 用户数据会丢失吗？
A: 不会，Supabase PostgreSQL 是持久化存储。

---

## 预计总工时

| 阶段 | 时间 |
|---|---|
| 阶段一：数据库迁移 | 1.5 小时 |
| 阶段二：后端改造 | 2.5 小时 |
| 阶段三：前端调整 | 0.5 小时 |
| 阶段四：部署配置 | 1 小时 |
| 阶段五：清理文档 | 1 小时 |
| **总计** | **6.5 小时** |

---

*计划创建时间：2026-05-08*
*目标：部署到 Vercel + Supabase*
