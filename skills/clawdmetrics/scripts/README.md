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
