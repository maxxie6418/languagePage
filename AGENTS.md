# AGENTS.md — 英语学习站

## Quick start
```bash
npm install
cp .env.example .env   # edit JWT_SECRET, optionally DEEPSEEK_API_KEY
npm run init-db         # creates data/learning.db
npm run seed-db         # 497 words, 56 knowledge points, 13 questions
npm run dev             # nodemon, auto-restart on :3000
```

## Commands
| Command | What |
|---|---|
| `npm start` | production (`node backend/server.js`) |
| `npm run dev` | development (nodemon, auto-restart) |
| `npm run init-db` | create/recreate all tables in `data/learning.db` |
| `npm run seed-db` | insert seed data (idempotent: `INSERT OR IGNORE`) |

## Architecture
- **Backend**: Express MVC — entrypoint `backend/server.js`, then `controllers/`, `models/`, `routes/`, `middleware/`, `config/`
- **Frontend**: single-file SPA at `public/index.html` — no build step, no framework, CSS + JS inline
- **Database**: SQLite3 at `data/learning.db` (gitignored), accessed via `backend/config/database.js`
- **Auth**: JWT (7d expiry, HS256), first user = admin, max 50 users
- **AI**: DeepSeek API proxied via raw `https`/`http` module (no SDK). Config priority: `ai_configs` table row > `DEEPSEEK_API_KEY`/`DEEPSEEK_BASE_URL` env vars > hardcoded default

## API routes
| Prefix | Module |
|---|---|
| `/api/auth/*` | register, login, get current user |
| `/api/words/*` | list (search/filter), detail, user status, batch status |
| `/api/knowledge/*` | list (module filter), detail, user status |
| `/api/user/ebbinghaus/*` | today reviews, calendar, review action, settings |
| `/api/quiz/*` | random questions, submit, history, mistakes |
| `/api/ai/*` | chat, grammar, word deep-dive, essay review |
| `/api/admin/*` | user CRUD, AI config |
| `/api/health` | health check |

## Ebbinghaus flow
- Marking word/knowledge `mastered` auto-generates 6 review stages (1/2/4/7/15/30 days) in `ebbinghaus_records`
- Review "mastered" → that stage marked `done`; "unmastered" → item reset to `unmastered` in `user_words`/`user_knowledge` AND all pending stages set to `skipped`

## Project directories
- `languagesource/` — raw (uncalibrated) English corpus materials, not yet integrated into the app

## Gotchas
- **No linter, no typechecker, no tests** — manually verify all changes
- Entire frontend is one file: `public/index.html`. CSS + JS inline. No separate JS/CSS files.
- `frontend/` directory exists but is empty — not used in the app
- `.env` and `data/*.db` are gitignored
- JWT_SECRET fallback `'your-secret-key-change-in-production'` is hardcoded in **both** `backend/middleware/auth.js:4` and `backend/controllers/authController.js:5` — change both if you change one
- All UI text and code comments are in Chinese
- **Admin routes have NO role check whatsoever** — `backend/routes/admin.js` uses the standard `authMiddleware` but `backend/controllers/adminController.js` never checks `req.user.role`. Any authenticated user can call admin endpoints.
- When seeded, `ai_configs.is_enabled` defaults to `0` — admin must toggle in settings to use AI features
- AI calls use raw Node `https`/`http` module, not `fetch` or an SDK — `backend/controllers/aiController.js`
- `init-db` drops and recreates all tables (destructive), `seed-db` is idempotent
- Windows convenience script `启动.bat` provides a one-click setup/start menu
