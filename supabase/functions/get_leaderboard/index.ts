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

    // 方法 1: 如果数据存储在数据库表中，取消下面的注释并调整表名
    /*
    const { data, error } = await supabaseClient
      .from('leaderboard') // 替换为你的实际表名
      .select('id, name, score')
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
    */

    // 方法 2: 使用模拟数据（用于测试，如果还没有数据库表）
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
