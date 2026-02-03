'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import { supabase } from '@/lib/supabaseClient'

interface LeaderboardEntry {
  id?: string
  name: string
  score: number
  rank: number
  user?: string  // 兼容函数返回的 user 字段
  [key: string]: any
}

export default function Home() {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        setError(null)
        
        // 调用 PostgreSQL RPC 函数 get_leaderboard
        const { data: result, error: supabaseError } = await supabase.rpc('get_leaderboard', { 
          days_ago: 7 
        })
        
        if (supabaseError) {
          console.error('Supabase RPC error:', supabaseError)
          // 提供更详细的错误信息
          const errorMessage = supabaseError.message || 'Unknown error'
          
          // 检查是否是 API key 错误
          if (errorMessage.includes('Invalid API key') || errorMessage.includes('JWT') || errorMessage.includes('invalid')) {
            throw new Error('API 密钥无效。请检查 Vercel 环境变量中的 NEXT_PUBLIC_SUPABASE_ANON_KEY 是否正确配置。')
          }
          
          // 检查是否是函数未找到的错误
          if (errorMessage.includes('function') && errorMessage.includes('does not exist')) {
            throw new Error('PostgreSQL 函数 "get_leaderboard" 未找到。请确保已在 Supabase 数据库中创建该函数。')
          }
          
          // 检查是否是权限错误
          if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
            throw new Error('没有权限调用该函数。请检查数据库权限设置。')
          }
          
          // 检查是否是环境变量缺失
          if (errorMessage.includes('Missing') || errorMessage.includes('undefined')) {
            throw new Error('环境变量未配置。请在 Vercel 设置中添加 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。')
          }
          
          throw new Error(`数据库函数错误: ${errorMessage}`)
        }
        
        // 处理不同的数据格式
        let leaderboardData: LeaderboardEntry[] = []
        
        if (result && Array.isArray(result)) {
          // 如果返回的是数组，直接使用
          leaderboardData = result
        } else if (result && result.leaderboard && Array.isArray(result.leaderboard)) {
          // 如果返回的是对象，包含 leaderboard 字段（Supabase 函数返回格式）
          leaderboardData = result.leaderboard.map((item: any, index: number) => ({
            id: item.id || `user-${index}`,
            name: item.user || item.name || `用户 ${index + 1}`, // 兼容 user 和 name 字段
            score: item.score || 0,
            rank: item.rank || index + 1,
            ...item // 保留其他字段
          }))
        } else if (result && result.data && Array.isArray(result.data)) {
          // 如果返回的是对象，包含 data 字段
          leaderboardData = result.data
        } else if (result === null || result === undefined) {
          // 如果返回 null 或 undefined，可能是函数返回了空数据
          leaderboardData = []
        } else {
          console.warn('Unexpected data format:', result)
          throw new Error('返回的数据格式不正确。期望格式: {leaderboard: [...]} 或 [...]')
        }
        
        setData(leaderboardData)
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        const errorMessage = err instanceof Error 
          ? err.message 
          : typeof err === 'string' 
            ? err 
            : 'Failed to fetch leaderboard data'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // 准备图表数据
  const chartData = data.map((item) => ({
    name: item.name || item.user || `用户 ${item.id || item.rank}`,
    score: item.score || 0,
  }))

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">ClawdMetrics Dashboard</h1>
          <Link
            href="/onboarding"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors text-sm"
          >
            📖 Get Started
          </Link>
        </div>
        
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">加载中...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-8">
            <p className="text-red-400">错误: {error}</p>
          </div>
        )}
        
        {!loading && !error && data.length > 0 && (
          <>
            {/* Tremor Bar Chart */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">排行榜图表</h2>
              <BarChart
                data={chartData}
                index="name"
                categories={["score"]}
                colors={["blue"]}
                yAxisWidth={60}
                showAnimation={true}
                className="h-80"
              />
            </div>

            {/* Tremor Table */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">排行榜详情</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="text-white">排名</TableHeaderCell>
                    <TableHeaderCell className="text-white">名称</TableHeaderCell>
                    <TableHeaderCell className="text-white">分数</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={item.id || `rank-${item.rank || index}`}>
                      <TableCell className="text-gray-300">{item.rank || index + 1}</TableCell>
                      <TableCell className="text-gray-300">{item.name || item.user || `用户 ${index + 1}`}</TableCell>
                      <TableCell className="text-gray-300">{item.score || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">暂无数据</p>
          </div>
        )}
      </div>
    </main>
  )
}
