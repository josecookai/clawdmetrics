# 📝 更新 Supabase Edge Function 代码指南

## 🎯 需要更新的代码

将以下代码复制到 Supabase Dashboard 的 Edge Function 编辑器中：

```typescript
Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // 处理 CORS preflight 请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Simple public leaderboard response
    const data = {
      leaderboard: [
        { rank: 1, user: 'alice', score: 1200 },
        { rank: 2, user: 'bob', score: 1100 },
        { rank: 3, user: 'carol', score: 900 }
      ]
    };
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ 
        error: 'internal_error', 
        message: String(err) 
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});
```

---

## 📋 更新步骤

### 步骤 1: 打开 Supabase Dashboard
1. 访问 https://app.supabase.com
2. 选择项目：`cvzmvsnztqtehoquirft`
3. 进入 **Edge Functions** → **get_leaderboard**

### 步骤 2: 更新代码
1. 点击 **Code** 标签
2. 删除现有代码
3. 粘贴上面的新代码
4. 点击 **Deploy** 按钮

### 步骤 3: 测试
1. 点击 **Test** 按钮
2. 确认返回 200 状态码
3. 检查返回的数据格式

---

## ✨ 改进内容

### 新增功能：
- ✅ **CORS 支持**：添加了跨域访问 headers
- ✅ **OPTIONS 处理**：正确处理 CORS preflight 请求
- ✅ **错误日志**：添加了 `console.error` 用于调试
- ✅ **明确状态码**：明确指定 200 和 500 状态码

### 保持不变：
- ✅ 数据格式：`{leaderboard: [...]}`
- ✅ 字段结构：`{rank, user, score}`
- ✅ 错误处理：try-catch 结构

---

## 🔍 验证更新

更新后，在浏览器控制台测试：

```javascript
// 测试 CORS
fetch('https://cvzmvsnztqtehoquirft.supabase.co/functions/v1/get_leaderboard', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY',
    'Content-Type': 'application/json',
  }
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

应该能成功获取数据，且没有 CORS 错误。

---

## 📝 注意事项

1. **部署后立即生效**：代码更新后需要重新部署
2. **测试很重要**：使用 Supabase Dashboard 的 Test 功能验证
3. **日志查看**：如果遇到问题，查看 **Logs** 标签中的错误信息

---

## ✅ 完成

更新完成后，你的 Vercel 应用应该能够正常调用这个函数，不会再出现 CORS 错误！
