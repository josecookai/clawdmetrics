# PostgreSQL RPC 函数更新说明

## 📝 更改内容

已将 Edge Function 调用改为 PostgreSQL RPC 函数调用。

### 之前的代码：
```typescript
const { data: result, error: supabaseError } = await supabase.functions.invoke('get_leaderboard', {
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 更新后的代码：
```typescript
const { data: result, error: supabaseError } = await supabase.rpc('get_leaderboard', { 
  days_ago: 7 
})
```

---

## 🔄 主要变化

1. **调用方式**：
   - ❌ `supabase.functions.invoke()` → ✅ `supabase.rpc()`

2. **参数传递**：
   - ❌ 通过 headers 传递 → ✅ 通过函数参数传递 `{ days_ago: 7 }`

3. **错误处理**：
   - 更新了错误消息，针对 PostgreSQL 函数错误
   - 检查函数是否存在
   - 检查权限问题

4. **数据处理**：
   - ✅ 保持不变，支持多种数据格式
   - 支持数组格式：`[{rank, user, score}]`
   - 支持对象格式：`{leaderboard: [...]}`

---

## 📊 PostgreSQL RPC 函数说明

### 函数签名
```sql
CREATE OR REPLACE FUNCTION get_leaderboard(days_ago INTEGER DEFAULT 7)
RETURNS TABLE (
  rank INTEGER,
  user TEXT,
  score INTEGER
) AS $$
-- 函数实现
$$ LANGUAGE plpgsql;
```

### 调用方式
```typescript
// 使用默认参数（7天）
const { data, error } = await supabase.rpc('get_leaderboard')

// 指定天数
const { data, error } = await supabase.rpc('get_leaderboard', { days_ago: 30 })
```

---

## ✅ 保持不变的功能

- ✅ Loading 状态处理
- ✅ Error 状态处理
- ✅ 数据格式兼容性（支持多种返回格式）
- ✅ 图表和表格显示逻辑
- ✅ UI 组件和样式

---

## 🧪 测试

更新后，应用会：
1. 调用 PostgreSQL 函数 `get_leaderboard`
2. 传递参数 `days_ago: 7`（获取过去7天的数据）
3. 处理返回的排行榜数据
4. 在图表和表格中显示

---

## 📝 注意事项

1. **函数必须存在**：确保在 Supabase 数据库中已创建 `get_leaderboard` 函数
2. **权限设置**：确保 `anon` 角色有权限调用该函数
3. **返回格式**：函数应返回数组格式的数据

---

## 🔍 验证步骤

1. 检查 Supabase Dashboard → Database → Functions
2. 确认 `get_leaderboard` 函数存在
3. 测试函数调用是否成功
4. 验证返回的数据格式
