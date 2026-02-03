# 🔧 Vercel 环境变量配置指南

## ❌ 错误：Invalid API key

这个错误通常表示 Vercel 部署中缺少或配置错误的环境变量。

---

## ✅ 解决步骤

### 步骤 1: 进入 Vercel 项目设置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到并点击你的项目：`clawdmetrics`
3. 点击 **Settings**（设置）

### 步骤 2: 配置环境变量

1. 在左侧菜单中点击 **Environment Variables**
2. 添加以下两个环境变量：

#### 变量 1:
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://cvzmvsnztqtehoquirft.supabase.co`
- **Environment**: 选择所有环境（Production, Preview, Development）

#### 变量 2:
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2em12c256dHF0ZWhvcXVpcmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDU2MjQsImV4cCI6MjA4NjAyMTYyNH0.sb_publishable_KquiVSEIX_81Cc5h6bQe-Q_ynLkIwgQ`
- **Environment**: 选择所有环境（Production, Preview, Development）

### 步骤 3: 重要提示 ⚠️

**关键点**：
- ✅ 变量名必须以 `NEXT_PUBLIC_` 开头（客户端可访问）
- ✅ 确保选择所有环境（Production, Preview, Development）
- ✅ 添加后点击 **Save**

### 步骤 4: 重新部署

**重要**：修改环境变量后，必须重新部署项目才能生效！

1. 在 Vercel Dashboard 中，进入 **Deployments** 标签
2. 点击最新的部署右侧的 **⋯** 菜单
3. 选择 **Redeploy**
4. 或者推送新的代码到 GitHub（会自动触发部署）

---

## 🔍 验证环境变量

### 方法 1: 在 Vercel Dashboard 中检查

1. Settings → Environment Variables
2. 确认两个变量都存在
3. 检查变量名拼写是否正确（区分大小写）

### 方法 2: 在浏览器控制台检查

部署后，在浏览器控制台运行：

```javascript
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

如果显示 `undefined`，说明环境变量未正确设置。

---

## 🚨 常见问题

### 问题 1: 变量名错误

**错误示例**：
- `SUPABASE_URL` ❌（缺少 `NEXT_PUBLIC_` 前缀）
- `next_public_supabase_url` ❌（大小写错误）

**正确示例**：
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅

### 问题 2: 只设置了 Production 环境

如果只设置了 Production，Preview 和 Development 环境仍然会失败。

**解决**：确保选择所有三个环境。

### 问题 3: 忘记重新部署

修改环境变量后，必须重新部署才能生效。

**解决**：手动触发重新部署。

### 问题 4: API Key 值错误

确保复制完整的 JWT token，包括所有部分。

---

## 📋 检查清单

在修复后，确认：

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已设置
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已设置
- [ ] 两个变量都选择了所有环境
- [ ] 变量名拼写正确（区分大小写）
- [ ] 已重新部署项目
- [ ] 浏览器控制台没有显示 `undefined`

---

## 🎯 快速修复命令

如果使用 Vercel CLI：

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 输入值: https://cvzmvsnztqtehoquirft.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# 输入值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

然后重新部署：

```bash
vercel --prod
```

---

## ✅ 完成

配置完成后，应用应该能够：
- ✅ 正确连接到 Supabase
- ✅ 调用 PostgreSQL RPC 函数
- ✅ 显示排行榜数据

如果仍有问题，请检查：
1. Supabase 项目是否正常运行
2. PostgreSQL 函数 `get_leaderboard` 是否存在
3. 浏览器控制台的详细错误信息
