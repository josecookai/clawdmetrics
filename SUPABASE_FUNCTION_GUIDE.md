# Supabase Edge Function 部署指南

## 📋 概述

本指南将帮助你创建并部署 `get_leaderboard` Edge Function 到 Supabase 项目。

---

## 🚀 方法一：使用 Supabase CLI（推荐）

### 步骤 1: 安装 Supabase CLI

**macOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**或者使用 npm:**
```bash
npm install -g supabase
```

**Windows:**
```bash
# 使用 Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 或使用 npm
npm install -g supabase
```

### 步骤 2: 登录 Supabase

```bash
supabase login
```

这会打开浏览器让你登录 Supabase 账号。

### 步骤 3: 初始化 Supabase 项目（如果还没有）

```bash
cd /Users/bowenwang/agent微信走路/clawdmetrics
supabase init
```

### 步骤 4: 链接到你的 Supabase 项目

```bash
supabase link --project-ref cvzmvsnztqtehoquirft
```

### 步骤 5: 创建 Edge Function

```bash
supabase functions new get_leaderboard
```

这会在 `supabase/functions/get_leaderboard/` 目录下创建函数模板。

### 步骤 6: 编写函数代码

编辑 `supabase/functions/get_leaderboard/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // 示例：从数据库表获取排行榜数据
    // 请根据你的实际数据库表结构调整以下查询
    
    // 方法 1: 如果数据存储在数据库表中
    const { data, error } = await supabaseClient
      .from('leaderboard') // 替换为你的表名
      .select('*')
      .order('score', { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    // 添加排名
    const leaderboardData = data?.map((item, index) => ({
      ...item,
      rank: index + 1
    })) || []

    return new Response(
      JSON.stringify(leaderboardData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### 步骤 7: 部署函数

```bash
supabase functions deploy get_leaderboard
```

### 步骤 8: 测试函数

```bash
supabase functions invoke get_leaderboard
```

---

## 🌐 方法二：使用 Supabase Dashboard（Web 界面）

### 步骤 1: 访问 Supabase Dashboard

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目：`cvzmvsnztqtehoquirft`

### 步骤 2: 创建 Edge Function

1. 在左侧菜单中找到 **Edge Functions**
2. 点击 **Create a new function**
3. 函数名称输入：`get_leaderboard`
4. 点击 **Create function**

### 步骤 3: 编写函数代码

在代码编辑器中粘贴以下代码：

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // 从数据库表获取排行榜数据
    // 请根据你的实际数据库表结构调整
    const { data, error } = await supabaseClient
      .from('leaderboard') // 替换为你的表名
      .select('*')
      .order('score', { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    // 添加排名
    const leaderboardData = data?.map((item, index) => ({
      ...item,
      rank: index + 1
    })) || []

    return new Response(
      JSON.stringify(leaderboardData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### 步骤 4: 部署函数

1. 点击 **Deploy** 按钮
2. 等待部署完成（通常几秒钟）

### 步骤 5: 测试函数

1. 点击 **Invoke** 按钮
2. 查看返回结果

---

## 📊 根据你的数据结构调整代码

### 情况 1: 数据存储在数据库表中

如果你的排行榜数据存储在 Supabase 数据库表中，使用上面的代码即可。只需将 `'leaderboard'` 替换为你的实际表名。

**示例表结构：**
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 情况 2: 使用模拟数据（测试用）

如果还没有数据库表，可以使用模拟数据：

```typescript
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 模拟数据
    const mockData = [
      { id: '1', name: '用户1', score: 1000, rank: 1 },
      { id: '2', name: '用户2', score: 950, rank: 2 },
      { id: '3', name: '用户3', score: 850, rank: 3 },
      { id: '4', name: '用户4', score: 750, rank: 4 },
      { id: '5', name: '用户5', score: 650, rank: 5 },
    ]

    return new Response(
      JSON.stringify(mockData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### 情况 3: 从多个表关联查询

```typescript
const { data, error } = await supabaseClient
  .from('users')
  .select(`
    id,
    name,
    scores (
      score,
      created_at
    )
  `)
  .order('score', { ascending: false })
```

---

## 🧪 测试 Edge Function

### 方法 1: 在 Supabase Dashboard 中测试

1. 进入 Edge Functions 页面
2. 找到 `get_leaderboard` 函数
3. 点击 **Invoke** 按钮
4. 查看返回结果

### 方法 2: 使用 curl 测试

```bash
curl -X POST \
  'https://cvzmvsnztqtehoquirft.supabase.co/functions/v1/get_leaderboard' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

### 方法 3: 在前端应用中测试

你的 Next.js 应用已经配置好了调用代码：

```typescript
const { data: result, error: supabaseError } = await supabase.functions.invoke('get_leaderboard')
```

---

## 🔧 常见问题排查

### 问题 1: 函数返回 404

**原因**: 函数未部署或名称不匹配

**解决**:
- 检查函数名称是否为 `get_leaderboard`
- 确认函数已成功部署
- 检查 Supabase 项目是否正确

### 问题 2: CORS 错误

**原因**: 函数未设置 CORS 头

**解决**: 确保函数代码中包含 `corsHeaders`

### 问题 3: 数据库查询错误

**原因**: 表名或字段名不正确

**解决**:
- 检查数据库表是否存在
- 确认表名和字段名拼写正确
- 检查 RLS (Row Level Security) 策略

### 问题 4: 权限错误

**原因**: RLS 策略限制访问

**解决**:
- 在 Supabase Dashboard 中检查表的 RLS 策略
- 确保 `anon` 角色有读取权限
- 或者在 Edge Function 中使用 service role key

---

## 📝 推荐的函数代码（完整版）

这是一个更健壮的版本，包含错误处理和日志：

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    // 查询排行榜数据
    // 注意：请根据你的实际表名和字段名调整
    const { data, error } = await supabaseClient
      .from('leaderboard') // 替换为你的表名
      .select('id, name, score') // 选择需要的字段
      .order('score', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // 添加排名
    const leaderboardData = (data || []).map((item, index) => ({
      id: item.id,
      name: item.name,
      score: item.score,
      rank: index + 1
    }))

    return new Response(
      JSON.stringify(leaderboardData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

---

## ✅ 部署检查清单

- [ ] Supabase CLI 已安装（如果使用方法一）
- [ ] 已登录 Supabase
- [ ] Edge Function `get_leaderboard` 已创建
- [ ] 函数代码已编写并保存
- [ ] 函数已成功部署
- [ ] 函数测试通过（返回数据）
- [ ] 前端应用可以成功调用函数

---

## 🎯 下一步

部署完成后：

1. **测试函数**: 在 Supabase Dashboard 中点击 "Invoke" 测试
2. **更新前端**: 你的 Next.js 应用已经配置好了，无需修改
3. **运行应用**: `npm run dev` 查看效果
4. **部署应用**: 按照 `DEPLOYMENT.md` 部署到 Vercel/Replit

---

**需要帮助？** 如果遇到问题，请检查：
- Supabase Dashboard 中的函数日志
- 浏览器控制台的错误信息
- 网络请求的响应状态码
