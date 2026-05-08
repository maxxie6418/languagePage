# 英语学习站

一个面向英语基础学习的在线学习管理平台，支持多用户进度隔离、艾宾浩斯记忆法、AI智能答疑等功能。

## 技术栈

- **后端**: Node.js + Express（Vercel Serverless）
- **数据库**: PostgreSQL（Supabase）
- **前端**: 原生 HTML/CSS/JavaScript
- **AI服务**: DeepSeek API（后端代理）
- **部署**: Vercel + Supabase

## 项目结构

```
languagePage/
├── backend/              # 后端代码
│   ├── controllers/      # 控制器
│   ├── middleware/       # 中间件
│   ├── models/           # 数据模型（PostgreSQL）
│   ├── routes/           # 路由
│   ├── config/           # 配置（pg 连接池）
│   └── server.js         # 服务器入口（Vercel Serverless 导出）
├── public/               # 静态文件
│   └── index.html        # 主页（单页应用，含所有CSS/JS）
├── database/             # 数据库脚本
│   ├── migrations/       # 数据库初始化脚本
│   └── seeds/            # 种子数据脚本
├── languagesource/       # 原始英语语料素材（未整合）
├── docs/                 # 产品文档
├── frontend/             # （空目录，未使用）
├── style-showcase.html   # 风格预览展示页
├── 启动.bat / 开始.bat   # Windows 一键启动脚本
├── start.bat / start.ps1 # Windows 启动菜单脚本
├── vercel.json           # Vercel 部署配置
├── package.json
└── README.md
```

## 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `DATABASE_URL` | ✅ | Supabase PostgreSQL 连接字符串 |
| `JWT_SECRET` | ✅ | JWT 签名密钥 |
| `DEEPSEEK_API_KEY` | ❌ | DeepSeek API 密钥（AI功能需要） |
| `DEEPSEEK_BASE_URL` | ❌ | DeepSeek API 地址（默认 `https://api.deepseek.com`） |

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 DATABASE_URL 等配置

# 3. 启动开发服务器
npm run dev
```

服务将在 `http://localhost:3000` 启动。

> ⚠️ **注意**：本地开发默认连接 Supabase 生产数据库。如需隔离测试数据，建议创建单独的 Supabase 开发项目。

## 部署到 Vercel

### 方式一：GitHub 自动部署（推荐）

1. 将项目推送到 GitHub
2. 登录 [vercel.com](https://vercel.com)，用 GitHub 账号
3. 点击 **Add New... → Project**，导入 GitHub 仓库
4. 配置环境变量后点击 **Deploy**

后续每次 push 到 GitHub，Vercel 会自动重新部署。

### 方式二：CLI 部署

```bash
npm i -g vercel
vercel login
vercel --prod
```

在 Vercel Dashboard → Settings → Environment Variables 中配置：
- `DATABASE_URL`
- `JWT_SECRET`
- `DEEPSEEK_API_KEY`（可选）
- `DEEPSEEK_BASE_URL`

## 功能特性

- ✅ 用户系统（注册/登录，JWT认证）
- ✅ 单词学习（列表/卡片双视图，检测模式）
- ✅ 知识点学习（语法体系）
- ✅ 艾宾浩斯记忆法（自动复习提醒）
- ✅ 真题解析（阅读理解、完形填空等）
- ✅ 模拟测验（随机出题、错题本）
- ✅ AI智能答疑（DeepSeek）
- ✅ 数据导入导出

## 相关文档

- [产品需求文档](docs/英语学习站_PRD_v1.1.md)
- [设计规范文档](docs/英语学习站_设计规范_v1.0.md)
- [Vercel 部署改造计划](docs/VERCEL_DEPLOY_PLAN.md)
- [项目开发指南](AGENTS.md)

## License

MIT
