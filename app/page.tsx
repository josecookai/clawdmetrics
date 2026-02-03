'use client'

import { useEffect, useState } from 'react'
import { BarChart, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import { supabase } from '@/lib/supabaseClient'

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  rank: number
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
        
        // 调用 Supabase 函数 get_leaderboard
        const { data: result, error: supabaseError } = await supabase.functions.invoke('get_leaderboard')
        
        if (supabaseError) {
          throw supabaseError
        }
        
        if (result && Array.isArray(result)) {
          // 如果返回的是数组，直接使用
          setData(result)
        } else if (result && result.data && Array.isArray(result.data)) {
          // 如果返回的是对象，包含 data 字段
          setData(result.data)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // 准备图表数据
  const chartData = data.map((item) => ({
    name: item.name || `用户 ${item.id}`,
    score: item.score || 0,
  }))

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">ClawdMetrics Dashboard</h1>
        
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
                    <TableRow key={item.id || index}>
                      <TableCell className="text-gray-300">{item.rank || index + 1}</TableCell>
                      <TableCell className="text-gray-300">{item.name || `用户 ${item.id}`}</TableCell>
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
