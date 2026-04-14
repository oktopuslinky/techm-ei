import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get emotional trend data (last 14 days)
    const emotionTrend = await sql`
      SELECT 
        DATE(r.created_at) as date,
        AVG(a.sentiment_score) as avg_sentiment
      FROM responses r
      JOIN ai_analysis a ON r.id = a.response_id
      WHERE r.user_id = ${user.id}
        AND r.created_at > NOW() - INTERVAL '14 days'
      GROUP BY DATE(r.created_at)
      ORDER BY date ASC
    `

    // Get weekly summaries
    const weeklySummaries = await sql`
      SELECT * FROM weekly_summaries
      WHERE user_id = ${user.id}
      ORDER BY week_start DESC
      LIMIT 4
    `

    // Get total responses count
    const statsResult = await sql`
      SELECT 
        COUNT(*) as total_responses,
        COUNT(DISTINCT DATE(created_at)) as active_days
      FROM responses
      WHERE user_id = ${user.id}
    `

    // Get most common themes
    const themesResult = await sql`
      SELECT a.key_themes
      FROM ai_analysis a
      JOIN responses r ON a.response_id = r.id
      WHERE r.user_id = ${user.id}
        AND a.key_themes IS NOT NULL
      ORDER BY a.created_at DESC
      LIMIT 20
    `

    // Flatten and count themes
    const themeCounts: Record<string, number> = {}
    themesResult.forEach((row) => {
      const themes = row.key_themes as string[]
      if (themes) {
        themes.forEach((theme) => {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1
        })
      }
    })

    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme)

    // Get personality data
    const personality = await sql`
      SELECT * FROM personality WHERE user_id = ${user.id}
    `

    // Get streak data
    const streak = await sql`
      SELECT * FROM streaks WHERE user_id = ${user.id}
    `

    return NextResponse.json({
      emotionTrend: emotionTrend.map((row) => ({
        date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sentiment: Number(row.avg_sentiment),
      })),
      weeklySummaries,
      stats: {
        totalResponses: Number(statsResult[0]?.total_responses || 0),
        activeDays: Number(statsResult[0]?.active_days || 0),
      },
      topThemes,
      personality: personality[0] || null,
      streak: streak[0] || null,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to get dashboard data' },
      { status: 500 }
    )
  }
}
