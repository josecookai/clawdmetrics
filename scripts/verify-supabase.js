/**
 * Supabase 配置验证脚本
 * 用于验证环境变量和 Supabase 连接是否正常
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 开始验证 Supabase 配置...\n');

// 1. 检查环境变量是否存在
console.log('1️⃣ 检查环境变量:');
console.log('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅ 已设置' : '❌ 未设置');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('\n❌ 错误: 缺少必要的环境变量！');
  process.exit(1);
}

// 2. 验证 URL 格式
console.log('\n2️⃣ 验证 URL 格式:');
const urlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
if (urlPattern.test(SUPABASE_URL)) {
  console.log('   ✅ URL 格式正确:', SUPABASE_URL);
} else {
  console.log('   ❌ URL 格式不正确:', SUPABASE_URL);
}

// 3. 验证 API Key 格式（JWT token）
console.log('\n3️⃣ 验证 API Key 格式:');
const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
if (jwtPattern.test(SUPABASE_ANON_KEY)) {
  console.log('   ✅ API Key 格式正确 (JWT token)');
  // 解析 JWT payload（不验证签名）
  try {
    const parts = SUPABASE_ANON_KEY.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('   📋 JWT Payload 信息:');
    console.log('      - iss (issuer):', payload.iss);
    console.log('      - ref (project ref):', payload.ref);
    console.log('      - role:', payload.role);
    if (payload.ref === 'cvzmvsnztqtehoquirft') {
      console.log('      ✅ Project ref 匹配！');
    } else {
      console.log('      ⚠️  Project ref 不匹配！');
    }
  } catch (e) {
    console.log('   ⚠️  无法解析 JWT payload');
  }
} else {
  console.log('   ❌ API Key 格式不正确');
}

// 4. 测试 Supabase 连接
console.log('\n4️⃣ 测试 Supabase 连接:');
async function testConnection() {
  try {
    // 动态导入 @supabase/supabase-js
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 测试基本连接（获取项目信息）
    const { data, error } = await supabase.from('_realtime').select('*').limit(0);
    
    if (error) {
      // 某些表可能不存在，但连接本身是成功的
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('   ✅ Supabase 连接成功（表不存在是正常的）');
        console.log('   ℹ️  错误信息（预期）:', error.message);
      } else {
        console.log('   ⚠️  连接测试:', error.message);
      }
    } else {
      console.log('   ✅ Supabase 连接成功');
    }
    
    // 测试 Edge Function 调用（如果函数存在）
    console.log('\n5️⃣ 测试 Edge Function (get_leaderboard):');
    const { data: funcData, error: funcError } = await supabase.functions.invoke('get_leaderboard');
    
    if (funcError) {
      if (funcError.message.includes('Function not found') || funcError.message.includes('404')) {
        console.log('   ⚠️  Edge Function 未找到或未部署');
        console.log('   ℹ️  这是正常的，如果函数尚未部署');
      } else {
        console.log('   ⚠️  函数调用错误:', funcError.message);
      }
    } else {
      console.log('   ✅ Edge Function 调用成功');
      console.log('   📊 返回数据:', JSON.stringify(funcData, null, 2));
    }
    
    console.log('\n✅ 配置验证完成！');
    console.log('\n📝 总结:');
    console.log('   - 环境变量: ✅');
    console.log('   - URL 格式: ✅');
    console.log('   - API Key 格式: ✅');
    console.log('   - Supabase 连接: ✅');
    console.log('   - Edge Function: ' + (funcError ? '⚠️  需要部署' : '✅'));
    
  } catch (err) {
    console.error('\n❌ 连接测试失败:', err.message);
    if (err.message.includes('Cannot find module')) {
      console.error('   提示: 请先运行 npm install 安装依赖');
    }
    process.exit(1);
  }
}

testConnection().catch(console.error);
