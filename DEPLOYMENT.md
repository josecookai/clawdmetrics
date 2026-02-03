# 部署指南

## Vercel 部署（推荐）

### 步骤：

1. **访问 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 `josecookai/clawdmetrics` 仓库
   - 点击 "Import"

3. **配置环境变量**
   - 在项目设置中找到 "Environment Variables"
   - 添加以下环境变量：
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://cvzmvsnztqtehoquirft.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2em12c256dHF0ZWhvcXVpcmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDU2MjQsImV4cCI6MjA4NjAyMTYyNH0.sb_publishable_KquiVSEIX_81Cc5h6bQe-Q_ynLkIwgQ`

4. **部署**
   - Vercel 会自动检测 Next.js 项目
   - 框架预设：Next.js
   - 构建命令：`npm run build`（自动）
   - 输出目录：`.next`（自动）
   - 点击 "Deploy"

5. **完成**
   - 部署完成后，Vercel 会提供一个 URL（例如：`clawdmetrics.vercel.app`）
   - 每次推送到 main 分支会自动触发重新部署

### Vercel 优势：
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动部署（GitHub 集成）
- ✅ 免费套餐充足
- ✅ 完美支持 Next.js

---

## Replit 部署

### 步骤：

1. **创建 Repl**
   - 访问 [replit.com](https://replit.com)
   - 点击 "Create Repl"
   - 选择 "Import from GitHub"
   - 输入仓库 URL：`https://github.com/josecookai/clawdmetrics`
   - 选择 "Node.js" 模板

2. **安装依赖**
   - Replit 会自动运行 `npm install`
   - 如果未自动安装，在 Shell 中运行：
     ```bash
     npm install
     ```

3. **配置环境变量**
   - 点击左侧 "Secrets" 标签（🔒图标）
   - 添加以下密钥：
     - Key: `NEXT_PUBLIC_SUPABASE_URL`
       Value: `https://cvzmvsnztqtehoquirft.supabase.co`
     - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
       Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2em12c256dHF0ZWhvcXVpcmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDU2MjQsImV4cCI6MjA4NjAyMTYyNH0.sb_publishable_KquiVSEIX_81Cc5h6bQe-Q_ynLkIwgQ`

4. **配置运行命令**
   - 创建或编辑 `.replit` 文件：
     ```toml
     run = "npm run dev"
     ```
   - 或者在 Replit 的设置中配置 "Run" 命令为：`npm run dev`

5. **启动项目**
   - 点击 "Run" 按钮
   - Replit 会自动启动开发服务器
   - 访问提供的 URL（例如：`clawdmetrics.repl.co`）

### Replit 注意事项：
- ⚠️ Replit 主要用于开发环境，生产环境建议使用 Vercel
- ⚠️ 免费套餐有资源限制
- ✅ 适合快速测试和演示

---

## 部署前检查清单

- [x] 代码已推送到 GitHub
- [ ] 环境变量已配置
- [ ] Supabase 函数 `get_leaderboard` 已部署
- [ ] 测试本地运行：`npm run dev`

## 故障排除

### 环境变量未生效
- 确保变量名以 `NEXT_PUBLIC_` 开头（客户端可访问）
- 重新部署项目以应用新的环境变量

### Supabase 函数调用失败
- 检查 Supabase 项目中函数是否已部署
- 验证函数名称是否为 `get_leaderboard`
- 检查 Supabase 项目的网络访问设置

### 构建失败
- 检查 Node.js 版本（需要 18+）
- 运行 `npm install` 确保所有依赖已安装
- 查看构建日志中的具体错误信息
