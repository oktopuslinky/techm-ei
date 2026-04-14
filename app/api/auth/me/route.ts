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

    // Get additional user data
    const [personality, points, streaks] = await Promise.all([
      sql`SELECT * FROM personality WHERE user_id = ${user.id}`,
      sql`SELECT * FROM points WHERE user_id = ${user.id}`,
      sql`SELECT * FROM streaks WHERE user_id = ${user.id}`,
    ])

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        age_group: user.age_group,
        onboarding_completed: user.onboarding_completed,
        created_at: user.created_at,
      },
      personality: personality[0] || null,
      points: points[0] || { total_points: 0, lifetime_points: 0 },
      streak: streaks[0] || { current_streak: 0, longest_streak: 0 },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}
