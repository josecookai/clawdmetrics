# Supabase OAuth Code Exchange Script

## 📋 概述

`exchange_code.py` 是一个命令行工具，用于将 Supabase OAuth 授权码交换为完整的会话对象（包含 access_token、refresh_token 等）。

## 🚀 使用方法

### 基本用法

```bash
python exchange_code.py <auth_code>
```

### 示例

```bash
# 设置环境变量
export NEXT_PUBLIC_SUPABASE_ANON_KEY='your_supabase_anon_key_here'

# 运行脚本
python exchange_code.py abc123def456ghi789...
```

## 📋 前置要求

1. **Python 3.6+**
2. **requests 库**：
   ```bash
   pip install requests
   ```
3. **环境变量**：
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名密钥

## 🔧 功能特性

- ✅ 从命令行接受授权码参数
- ✅ 从环境变量读取 Supabase 配置
- ✅ 使用 PKCE grant type 交换代码
- ✅ 自动创建配置目录（如果不存在）
- ✅ 保存会话到 `~/.config/clawdmetrics/session.json`
- ✅ 提供详细的成功/错误消息
- ✅ 显示会话摘要信息

## 📁 输出文件

会话数据保存在：
```
~/.config/clawdmetrics/session.json
```

文件包含完整的会话对象，包括：
- `access_token`: 访问令牌
- `refresh_token`: 刷新令牌
- `expires_in`: 过期时间（秒）
- `token_type`: 令牌类型
- `user`: 用户信息

## ⚠️ 注意事项

### PKCE Code Verifier

当前实现使用占位符 `code_verifier`。在生产环境中，你需要：

1. **在初始 OAuth 流程中生成 code_verifier**：
   ```python
   import secrets
   import base64
   
   code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
   ```

2. **安全存储 code_verifier**（例如在会话存储或加密文件中）

3. **在此脚本中检索并使用它**

### 安全建议

- 🔒 保护 `session.json` 文件（设置适当的文件权限）
- 🔒 不要将 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 提交到版本控制
- 🔒 在生产环境中使用环境变量或密钥管理服务

## 🐛 故障排除

### 错误：环境变量未设置

```
❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.
```

**解决**：设置环境变量
```bash
export NEXT_PUBLIC_SUPABASE_ANON_KEY='your_key_here'
```

### 错误：HTTP 400/401

可能是：
- 授权码已过期
- 授权码无效
- code_verifier 不匹配（需要实现正确的 PKCE 流程）

### 错误：网络连接失败

检查：
- 网络连接
- Supabase URL 是否正确
- 防火墙设置

## 📝 示例输出

```
🚀 Supabase OAuth Code Exchange
============================================================
🔄 Exchanging authorization code for session...
   Endpoint: https://cvzmvsnztqtehoquirft.supabase.co/auth/v1/token
   Code: abc123def456...
✅ Successfully exchanged code for session!
💾 Session saved to: /Users/username/.config/clawdmetrics/session.json
   File size: 1234 bytes

📋 Session Summary:
   --------------------------------------------------
   Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Refresh Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Expires In: 3600 seconds
   Token Type: bearer
   User Email: user@example.com
   User ID: 12345678-1234-1234-1234-123456789abc
   --------------------------------------------------

✅ Done! Session has been saved and is ready to use.
```

## 🔗 相关文档

- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-api)
- [OAuth PKCE Flow](https://oauth.net/2/pkce/)

---

# Stats Reporting Script

## 📋 概述

`report_stats.py` 是一个命令行工具，用于向 Supabase 报告每日统计数据（交互次数、输入 token、输出 token）。

## 🚀 使用方法

### 基本用法

```bash
python report_stats.py <interaction_count> <input_tokens> <output_tokens>
```

### 示例

```bash
# 设置环境变量
export SUPABASE_SERVICE_KEY='your_service_role_key_here'

# 运行脚本
python report_stats.py 10 5000 3000
```

## 📋 前置要求

1. **Python 3.6+**
2. **requests 库**：
   ```bash
   pip install requests
   ```
3. **环境变量**：
   - `SUPABASE_SERVICE_KEY`: Supabase service role key
4. **会话文件**：
   - `~/.config/clawdmetrics/session.json` (由 `exchange_code.py` 创建)

## 🔧 功能特性

- ✅ 从命令行接受三个参数（interaction_count, input_tokens, output_tokens）
- ✅ 从 `~/.config/clawdmetrics/session.json` 加载用户会话
- ✅ 提取 access_token 和 user_id
- ✅ 使用 service role key 进行认证
- ✅ 调用 Supabase RPC 函数 `upsert_daily_stats`
- ✅ 增量更新当天的统计数据
- ✅ 提供详细的成功/错误消息

## 📊 工作原理

1. **加载会话**: 从 `~/.config/clawdmetrics/session.json` 读取用户会话
2. **提取信息**: 获取 access_token 和 user_id
3. **认证**: 使用 service role key 进行 Supabase 认证
4. **调用 RPC**: 调用 `upsert_daily_stats` 函数更新统计数据
5. **增量更新**: 函数会增量更新当天的统计数据，而不是覆盖

## 📝 参数说明

- `interaction_count`: 交互次数（非负整数）
- `input_tokens`: 输入 token 数量（非负整数）
- `output_tokens`: 输出 token 数量（非负整数）

## ⚠️ 注意事项

### Service Role Key

- ⚠️ Service role key 具有管理员权限，请妥善保管
- ⚠️ 不要将 service role key 提交到版本控制
- ⚠️ 在生产环境中使用环境变量或密钥管理服务

### RPC 函数要求

脚本调用 `upsert_daily_stats` RPC 函数，该函数需要：
- 接受参数：`interaction_count`, `input_tokens`, `output_tokens`, `user_id` (可选)
- 增量更新当天的统计数据
- 如果记录不存在，则创建新记录

### 会话文件

- 会话文件必须由 `exchange_code.py` 创建
- 如果会话过期，需要重新运行 `exchange_code.py`

## 🐛 故障排除

### 错误：会话文件未找到

```
❌ Error: Session file not found.
```

**解决**：先运行 `exchange_code.py` 创建会话文件

### 错误：环境变量未设置

```
❌ Error: SUPABASE_SERVICE_KEY environment variable is not set.
```

**解决**：设置环境变量
```bash
export SUPABASE_SERVICE_KEY='your_service_role_key_here'
```

### 错误：RPC 函数未找到 (404)

**解决**：在 Supabase 数据库中创建 `upsert_daily_stats` 函数

### 错误：权限不足 (403)

**解决**：确保 service role key 有权限调用 RPC 函数

## 📝 示例输出

```
🚀 Supabase Stats Reporting
============================================================

1️⃣ Loading session...
   ✓ Session loaded from /Users/username/.config/clawdmetrics/session.json
   ✓ Access token found
   ✓ User ID: 12345678-1234-1234-1234-123456789abc

2️⃣ Checking service role key...
   ✓ Service role key found

3️⃣ Reporting stats...
📊 Reporting stats to Supabase...
   Endpoint: https://cvzmvsnztqtehoquirft.supabase.co/rest/v1/rpc/upsert_daily_stats
   Interaction Count: 10
   Input Tokens: 5000
   Output Tokens: 3000
   User ID: 12345678-1234-1234-1234-123456789abc
✅ Successfully reported stats!

📋 Stats Summary:
   --------------------------------------------------
   date: 2026-02-03
   user_id: 12345678-1234-1234-1234-123456789abc
   interaction_count: 10
   input_tokens: 5000
   output_tokens: 3000
   --------------------------------------------------

✅ Done! Stats have been reported successfully.
```

## 🔗 相关文档

- [Supabase RPC Functions](https://supabase.com/docs/reference/javascript/rpc)
- [Supabase Service Role Key](https://supabase.com/docs/guides/api/using-the-service-role-key)
