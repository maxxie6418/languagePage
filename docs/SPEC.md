# 英语学习平台设计文档

## 项目概述

**项目名称**: languagePage - 英语基础能力 + 考研应试双轨制学习平台

**核心定位**: 夯实英语基础能力（词汇、语法、阅读、写作、翻译）作为主线，考研应试技巧作为锚定在基础之上的支线。

## 技术架构

### 技术栈
- **前端**: Vue 3 SPA（前后端分离）
- **后端**: Node.js + Express
- **数据层**: JSON 文件（便于后续迁移到数据库）

### 项目结构

```
languagePage/
├── server/                     # Node.js 后端
│   ├── app.js                  # Express 入口
│   ├── routes/                 # 路由模块
│   │   ├── basics.js           # 基础学习区 API
│   │   ├── exam.js             # 考研应用区 API
│   │   ├── practice.js         # 试题中心 API
│   │   └── user.js             # 用户进度 API
│   ├── data/                   # JSON 数据文件
│   │   ├── grammar.json         # 语法树数据
│   │   ├── vocabulary.json      # 词汇词族数据
│   │   ├── exam-skills.json     # 题型方法论
│   │   ├── papers.json          # 真题索引
│   │   └── questions.json       # 练习题库
│   └── services/               # 业务逻辑层
│       ├── progress.js         # 进度追踪
│       └── review.js            # 错题本生成
│
├── public/                     # Vue 构建产物
│
├── src/                        # Vue 3 源码
│   ├── main.js
│   ├── App.vue
│   ├── router/index.js
│   ├── views/                  # 页面组件
│   │   ├── basics/             # 基础学习区
│   │   ├── exam/               # 考研应用区
│   │   └── practice/           # 试题中心
│   └── components/             # 公共组件
│
└── docs/                       # 文档
```

## 页面架构

### A. 基础学习区（/basics/*）
- `/basics/map` - 英语能力图谱页
- `/basics/vocabulary` - 词汇基础（词根词缀、核心词汇、搭配用法）
- `/basics/grammar` - 语法体系（完整语法树 + 交互拆解器）
- `/basics/reading` - 阅读素养（外刊精读、段落逻辑）
- `/basics/writing` - 写作表达
- `/basics/translation` - 翻译基础

### B. 考研应用区（/exam/*）
- `/exam/strategy` - 考纲与策略
- `/exam/skills` - 题型方法论
- `/exam/archive` - 真题数据中心
- `/exam/scoring` - 评分标准解析

### C. 独立试题中心（/practice/* 与 /test/*）
- `/practice/drill` - 专项练习
- `/test/paper` - 真题模考
- `/practice/review` - 错题重做
- `/test/diagnostic` - 基础能力自测

## API 设计

| 端点 | 方法 | 说明 |
|-----|-----|-----|
| `/api/basics/grammar` | GET | 返回语法树 JSON |
| `/api/basics/vocabulary/:root` | GET | 返回词根词族 |
| `/api/exam/papers` | GET | 返回真题列表 |
| `/api/exam/skills/:type` | GET | 返回题型方法论 |
| `/api/practice/questions` | GET | 按筛选条件返回试题 |
| `/api/practice/submit` | POST | 提交答案，返回得分与解析 |
| `/api/user/progress` | GET/POST | 学习进度与错题本 |

## 视觉设计

### 基础学习区
- 风格：米白/浅灰背景，深蓝标题，琥珀色标记重点
- 布局：高信息密度 Wiki 风格，双栏布局
- 字体：中文无衬线，英文衬线（增强阅读感）

### 试题中心
- 布局：单栏沉浸式，顶部进度条 + 计时器
- 模式：护眼模式（浅黄背景）或专注模式（纯白背景）
- 选项卡片化，选中后视觉反馈明确

## 数据量要求

- 词汇：不少于 30 个词族
- 语法：不少于 12 个核心节点
- 试题：不少于 50 道

## 核心原则

1. 所有考研技巧必须锚定在基础能力之上
2. 试题页面必须与基础学习内容物理隔离
3. 试题解析中涉及的知识点必须能在基础学习区找到对应内容
4. 禁止纯技巧灌输，必须基于文本证据作答

## 启动说明

```bash
cd server
npm install
npm start
# 访问 http://localhost:3000
```
