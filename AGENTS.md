# AGENTS.md — 考研英语学习站

## Quick start
```bash
npm install
cp .env.example .env   # edit JWT_SECRET, optionally DEEPSEEK_API_KEY
npm run init-db         # creates data/learning.db
npm run seed-db         # 497 words, 38 knowledge points, 13 questions
npm run dev             # nodemon, auto-restart
```

## Commands
| Command | What |
|---|---|
| `npm start` | production (node backend/server.js) |
| `npm run dev` | development (nodemon, auto-restart) |
| `npm run init-db` | create/recreate all tables in `data/learning.db` |
| `npm run seed-db` | insert 497 words, 38 grammar/roots points, 13 questions |

## Architecture
- **Backend**: Express MVC at `backend/server.js` — `controllers/`, `models/`, `routes/`, `middleware/`, `config/`
- **Frontend**: SPA in `public/index.html` (no build step, no framework — edit directly)
- **Database**: SQLite3 at `data/learning.db` (gitignored, `node: sqlite3`)
- **Auth**: JWT (7d expiry), first user = admin, max 50 users
- **AI**: DeepSeek API proxied (`/api/ai/*`), config in `ai_configs` table

## API routes (all live)
| Prefix | Module |
|---|---|
| `/api/auth/*` | register, login, get current user |
| `/api/words/*` | list (search/filter), detail, user status, batch status |
| `/api/knowledge/*` | list (module filter), detail, user status |
| `/api/user/ebbinghaus/*` | today reviews, calendar, review action, settings |
| `/api/quiz/*` | random questions, submit, history, mistakes |
| `/api/ai/*` | chat, grammar, word deep-dive, essay review |
| `/api/admin/*` | user CRUD, AI config |

## Ebbinghaus flow
- Marking word/knowledge `mastered` auto-generates 6 review stages (1/2/4/7/15/30 days)
- Review "mastered" → stage done; "unmastered" → item reset to `unmastered`, pending reviews skipped

## Gotchas
- **No linter, no typechecker, no tests** — manually verify changes
- Entire frontend is one file: `public/index.html`. CSS + JS inline.
- `frontend/` dirs are empty placeholders — not used
- `.env` and `data/*.db` are gitignored
- JWT_SECRET fallback hardcoded in `backend/middleware/auth.js` and `backend/controllers/authController.js`
- All UI text and code comments in **Chinese**
- Admin routes require `admin` role but use same auth middleware (no separate admin check middleware yet)
- When seeded, AI config `is_enabled` defaults to `0` — admin must toggle in settings to use AI features
