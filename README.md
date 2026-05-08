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
│   └── index.html        # 主页
├── docs/                 # 文档
├── vercel.json           # Vercel 部署配置
├── package.json
└── README.md
```

## 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | Supabase PostgreSQL 连接字符串 | `postgresql://postgres.xxx:password@aws-0-xxx.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET` | JWT 签名密钥 | 随机字符串 |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-xxx` |
| `DEEPSEEK_BASE_URL` | DeepSeek API 地址 | `https://api.deepseek.com` |

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

## 部署到 Vercel

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

在 Vercel Dashboard 中配置环境变量：
- `DATABASE_URL`
- `JWT_SECRET`
- `DEEPSEEK_API_KEY`
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

## License

MIT
