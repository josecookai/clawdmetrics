# 🚀 快速部署 get_leaderboard 函数（5分钟）

## 最简单的方法：使用 Supabase Dashboard（无需安装任何工具）

### 步骤 1: 打开 Supabase Dashboard
1. 访问 https://app.supabase.com
2. 登录你的账号
3. 选择项目：`cvzmvsnztqtehoquirft`

### 步骤 2: 创建 Edge Function
1. 在左侧菜单点击 **Edge Functions**
2. 点击 **Create a new function** 按钮
3. 函数名称输入：`get_leaderboard`
4. 点击 **Create function**

### 步骤 3: 复制粘贴代码
在代码编辑器中，删除默认代码，粘贴以下代码：

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 模拟排行榜数据（用于测试）
    const leaderboardData = [
      { id: '1', name: '用户1', score: 1000, rank: 1 },
      { id: '2', name: '用户2', score: 950, rank: 2 },
      { id: '3', name: '用户3', score: 850, rank: 3 },
      { id: '4', name: '用户4', score: 750, rank: 4 },
      { id: '5', name: '用户5', score: 650, rank: 5 },
      { id: '6', name: '用户6', score: 550, rank: 6 },
      { id: '7', name: '用户7', score: 450, rank: 7 },
      { id: '8', name: '用户8', score: 350, rank: 8 },
    ]

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

### 步骤 4: 部署
1. 点击右上角的 **Deploy** 按钮
2. 等待几秒钟，看到 "Deployed successfully" 提示

### 步骤 5: 测试
1. 点击 **Invoke** 按钮
2. 应该看到返回的 JSON 数据

## ✅ 完成！

现在你的函数已经部署好了，Next.js 应用可以正常调用它了。

---

## 🔄 如果要从数据库读取真实数据

如果你有数据库表存储排行榜数据，将步骤 3 的代码替换为：

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    // 从数据库表读取数据（替换 'leaderboard' 为你的表名）
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .select('id, name, score')
      .order('score', { ascending: false })
      .limit(100)

    if (error) throw error

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

---

## 📚 更多信息

详细说明请查看 `SUPABASE_FUNCTION_GUIDE.md`
