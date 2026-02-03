# 🔧 故障排除指南 - Edge Function 错误

## ❌ 错误信息："Failed to send a request to the Edge Function"

### 可能的原因和解决方案

#### 1. Edge Function 未部署 ⚠️（最常见）

**症状**: 错误信息包含 "Function not found" 或 "404"

**解决步骤**:
1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 选择项目：`cvzmvsnztqtehoquirft`
3. 进入 **Edge Functions** 页面
4. 检查是否存在 `get_leaderboard` 函数
5. 如果不存在，按照 `QUICK_START_FUNCTION.md` 创建并部署

**验证方法**:
- 在 Supabase Dashboard 中点击函数的 **Invoke** 按钮
- 应该能看到返回的数据

---

#### 2. 环境变量未正确配置 ⚠️

**症状**: 函数调用失败，但函数已部署

**检查步骤**:

**在 Vercel 中**:
1. 进入 Vercel 项目设置
2. 点击 **Settings** → **Environment Variables**
3. 确认以下变量已设置：
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://cvzmvsnztqtehoquirft.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（完整 token）

4. **重要**: 确保变量名以 `NEXT_PUBLIC_` 开头
5. 重新部署项目（修改环境变量后需要重新部署）

**验证方法**:
- 在 Vercel 的部署日志中检查环境变量是否正确加载
- 在浏览器控制台检查是否有环境变量相关的错误

---

#### 3. CORS 配置问题

**症状**: 浏览器控制台显示 CORS 错误

**解决步骤**:
1. 检查 Edge Function 代码中是否包含 CORS headers
2. 确保函数代码包含：

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

3. 在函数响应中包含这些 headers

---

#### 4. 网络/连接问题

**症状**: 超时或连接失败

**检查步骤**:
1. 检查 Supabase 项目状态（在 Dashboard 中查看）
2. 检查 Vercel 部署日志
3. 尝试在 Supabase Dashboard 中直接调用函数

---

#### 5. 函数代码错误

**症状**: 函数已部署但返回错误

**检查步骤**:
1. 在 Supabase Dashboard 中查看函数的日志
2. 点击函数名称 → **Logs** 标签
3. 查看错误信息并修复代码

---

## 🔍 调试步骤

### 步骤 1: 检查函数是否部署

在 Supabase Dashboard 中：
1. Edge Functions → 查看函数列表
2. 确认 `get_leaderboard` 存在
3. 点击 **Invoke** 测试函数

### 步骤 2: 检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 查看 **Console** 标签
3. 查看 **Network** 标签，找到对 Edge Function 的请求
4. 检查请求的 URL、状态码和响应

### 步骤 3: 检查 Vercel 日志

1. 在 Vercel Dashboard 中
2. 进入项目 → **Deployments**
3. 点击最新的部署
4. 查看 **Functions** 或 **Runtime Logs**

### 步骤 4: 测试函数调用

在浏览器控制台中运行：

```javascript
// 检查环境变量
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')

// 测试函数调用
const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const { data, error } = await supabase.functions.invoke('get_leaderboard')
console.log('Result:', data)
console.log('Error:', error)
```

---

## ✅ 快速修复清单

- [ ] Edge Function `get_leaderboard` 已在 Supabase 中部署
- [ ] 函数可以通过 Supabase Dashboard 的 Invoke 按钮成功调用
- [ ] Vercel 环境变量已正确配置（`NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
- [ ] 环境变量名称正确（以 `NEXT_PUBLIC_` 开头）
- [ ] 修改环境变量后已重新部署 Vercel 项目
- [ ] Edge Function 代码包含 CORS headers
- [ ] 浏览器控制台没有其他错误

---

## 🚀 推荐的修复流程

### 如果函数未部署：

1. 按照 `QUICK_START_FUNCTION.md` 快速部署函数
2. 在 Supabase Dashboard 中测试函数
3. 重新部署 Vercel 项目

### 如果函数已部署但仍报错：

1. **检查 Vercel 环境变量**:
   - 进入 Vercel 项目设置
   - 确认环境变量已设置
   - 重新部署项目

2. **检查函数日志**:
   - 在 Supabase Dashboard 中查看函数日志
   - 查找错误信息

3. **测试函数**:
   - 在 Supabase Dashboard 中直接调用函数
   - 确认函数返回正确的数据格式

4. **检查代码**:
   - 确认前端代码正确调用函数
   - 检查错误处理逻辑

---

## 📞 需要更多帮助？

如果以上步骤都无法解决问题，请提供：
1. 浏览器控制台的完整错误信息
2. Supabase Dashboard 中函数的日志
3. Vercel 部署日志中的相关错误
