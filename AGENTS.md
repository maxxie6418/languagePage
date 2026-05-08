# AGENTS.md — 英语学习站

## 快速开始

```bash
npm install
cp .env.example .env   # 编辑 DATABASE_URL、JWT_SECRET，可选 DEEPSEEK_API_KEY
npm run dev            # nodemon，自动重启，端口 :3000
```

## 命令列表

| 命令 | 说明 |
|---|---|
| `npm start` | 生产环境启动（`node backend/server.js`） |
| `npm run dev` | 开发环境启动（nodemon，修改代码自动重启） |
| `npm run vercel` | 部署预览到 Vercel |
| `npm run vercel-prod` | 部署正式环境到 Vercel |

## 架构说明

- **后端**：Express MVC 架构 — 入口 `backend/server.js`，下有 `controllers/`、`models/`、`routes/`、`middleware/`、`config/`
- **前端**：单页应用（SPA），全部在 `public/index.html` 中 — 无构建步骤，无框架，CSS + JS 内联
- **主题系统**：CSS 变量驱动的四主题切换（深色/明亮/鲜艳/卡片），通过 `data-theme` 属性控制
- **数据库**：Supabase PostgreSQL，通过 `pg` 连接池访问，路径 `backend/config/database.js`
- **认证**：JWT（7 天过期，HS256 算法），首个注册用户自动为管理员，最多注册 50 个用户
- **AI**：DeepSeek API，通过原生 Node `https`/`http` 模块代理（无 SDK）。配置优先级：`ai_configs` 表数据行 > `DEEPSEEK_API_KEY`/`DEEPSEEK_BASE_URL` 环境变量 > 硬编码默认值
- **部署**：Vercel Serverless Functions + Supabase PostgreSQL

## API 路由

| 前缀 | 模块 |
|---|---|
| `/api/auth/*` | 注册、登录、获取当前用户 |
| `/api/words/*` | 单词列表（搜索/筛选）、详情、用户状态、批量状态 |
| `/api/knowledge/*` | 知识点列表（模块筛选）、详情、用户状态 |
| `/api/user/ebbinghaus/*` | 今日复习、日历、复习操作、设置 |
| `/api/quiz/*` | 随机出题、提交答案、历史记录、错题本 |
| `/api/ai/*` | AI 聊天、语法分析、单词深解、作文批改 |
| `/api/admin/*` | 用户管理、AI 配置 |
| `/api/health` | 健康检查 |

## 艾宾浩斯记忆流程

- 将单词/知识点标记为 `mastered`（已掌握）时，会自动在 `ebbinghaus_records` 表中生成 6 个复习阶段（1/2/4/7/15/30 天后）
- 复习时点"掌握了" → 当前阶段标记为 `done`（已完成）
- 复习时点"未掌握" → 该词/知识点在 `user_words`/`user_knowledge` 中重置为 `unmastered`，且所有待复习阶段标记为 `skipped`（已跳过）

## 项目目录说明

| 目录 | 说明 |
|---|---|
| `backend/` | 后端 Express 应用（controllers / models / routes / middleware / config） |
| `public/` | 静态资源，仅 `index.html`（完整前端 SPA） |
| `database/` | 数据库迁移脚本和种子数据 |
| `languagesource/` | 原始英语语料素材（暂未整合到应用中） |
| `docs/` | 产品需求文档、设计规范、开发计划等 |
| `frontend/` | 空目录（目前未使用） |

## 环境变量

| 变量 | 必填 | 说明 |
|---|---|---|
| `DATABASE_URL` | ✅ | Supabase PostgreSQL 连接字符串（建议使用 Transaction 模式连接池） |
| `JWT_SECRET` | ✅ | JWT 签名密钥 |
| `DEEPSEEK_API_KEY` | ❌ | DeepSeek API 密钥（AI 功能需要） |
| `DEEPSEEK_BASE_URL` | ❌ | DeepSeek API 地址（默认 `https://api.deepseek.com`） |

## 注意事项

- **无 linter、无类型检查、无测试** — 修改后请手动验证所有变更
- **前端全在一个文件中**：`public/index.html`，CSS + JS 全部内联，没有独立的 JS/CSS 文件
- **`frontend/` 目录存在但为空** — 未在应用中使用
- **`.env` 和 `.vercel/` 已在 `.gitignore` 中忽略**
- **JWT_SECRET 回退值**：`'your-secret-key-change-in-production'` 硬编码在 `backend/middleware/auth.js:4` 和 `backend/controllers/authController.js:5` 两处 — 修改密钥时需要同时修改两个文件
- **所有界面文字和代码注释均为中文**
- **管理员路由没有角色校验** — `backend/routes/admin.js` 使用了标准 `authMiddleware`，但 `backend/controllers/adminController.js` 从未检查 `req.user.role`，因此任何已认证用户都可以调用管理员接口
- **AI 配置默认关闭**：初始化数据库后，`ai_configs.is_enabled` 默认为 `FALSE`，需管理员在设置页面中手动开启才能使用 AI 功能
- **AI 调用使用原生 Node `https`/`http` 模块**，没有使用 `fetch` 或 SDK — 见 `backend/controllers/aiController.js`
- **本地开发连接的是生产数据库** — 本地环境和 Vercel 使用同一个 Supabase 实例。建议在开发时创建独立的 Supabase 项目以避免影响生产数据
- **SQLite 已移除** — `sqlite3` 包已卸载，所有模型使用 `pg` 和 async/await
- **数据库模型使用 PostgreSQL 语法** — `$1, $2...` 参数占位符、`RETURNING id`、`ON CONFLICT DO NOTHING/UPDATE` 等
- **Windows 快捷脚本**：`启动.bat` 提供中文一键设置/启动菜单；`开始.bat` / `start.bat` / `start.ps1` 提供快速启动选项
