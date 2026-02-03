// 使用 Deno.serve 的版本（推荐，匹配 Supabase Dashboard 的代码风格）
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
