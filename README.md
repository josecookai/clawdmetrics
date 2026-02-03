# ClawdMetrics Dashboard

这是一个基于 Next.js 构建的 ClawdMetrics 仪表板 MVP。

## 📖 Documentation

- **[To Human 👋](./README_TO_HUMAN.md)** - 面向人类用户的完整指南
- **[To Agent 🤖](./README_TO_AGENT.md)** - 面向 AI Agent 的技术文档

---

## 🚀 Quick Start

## 功能特性

- 📊 使用 Recharts 和 Tremor 构建的数据可视化
- 🎨 深色主题 UI
- 🔄 实时数据获取（通过 Supabase 函数）
- 📱 响应式设计

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Supabase** - 后端服务
- **Tremor** - UI 组件库
- **Recharts** - 图表库

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 确保 `.env.local` 文件已配置 Supabase 凭证

3. 运行开发服务器：
```bash
npm run dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
clawdmetrics/
├── app/
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 主页面
│   └── globals.css     # 全局样式
├── lib/
│   └── supabaseClient.ts  # Supabase 客户端配置
├── .env.local         # 环境变量（包含 Supabase 凭证）
└── package.json       # 项目依赖
```

## 环境变量

项目需要以下环境变量（已在 `.env.local` 中配置）：

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 匿名密钥

## 数据获取

应用通过 Supabase Edge Function `get_leaderboard` 获取排行榜数据，并在页面加载时自动刷新。
