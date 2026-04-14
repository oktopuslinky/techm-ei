import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const [rewards, redemptions, points] = await Promise.all([
      sql`SELECT * FROM rewards WHERE is_active = true ORDER BY points_required ASC`,
      sql`
        SELECT r.*, rw.name as reward_name, rw.category
        FROM redemptions r
        JOIN rewards rw ON r.reward_id = rw.id
        WHERE r.user_id = ${user.id}
        ORDER BY r.redeemed_at DESC
      `,
      sql`SELECT * FROM points WHERE user_id = ${user.id}`,
    ])

    return NextResponse.json({
      rewards,
      redemptions,
      currentPoints: points[0]?.total_points || 0,
    })
  } catch (error) {
    console.error('Rewards error:', error)
    return NextResponse.json(
      { error: 'Failed to get rewards' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { rewardId } = await request.json()

    if (!rewardId) {
      return NextResponse.json(
        { error: 'Reward ID is required' },
        { status: 400 }
      )
    }

    // Get reward and user points
    const [rewards, points] = await Promise.all([
      sql`SELECT * FROM rewards WHERE id = ${rewardId} AND is_active = true`,
      sql`SELECT * FROM points WHERE user_id = ${user.id}`,
    ])

    if (rewards.length === 0) {
      return NextResponse.json(
        { error: 'Reward not found' },
        { status: 404 }
      )
    }

    const reward = rewards[0]
    const userPoints = points[0]?.total_points || 0

    if (userPoints < reward.points_required) {
      return NextResponse.json(
        { error: 'Not enough points' },
        { status: 400 }
      )
    }

    // Deduct points and create redemption
    await sql`
      UPDATE points
      SET total_points = total_points - ${reward.points_required},
          updated_at = NOW()
      WHERE user_id = ${user.id}
    `

    await sql`
      INSERT INTO redemptions (id, user_id, reward_id, points_spent)
      VALUES (${uuidv4()}, ${user.id}, ${rewardId}, ${reward.points_required})
    `

    return NextResponse.json({
      success: true,
      newBalance: userPoints - reward.points_required,
    })
  } catch (error) {
    console.error('Redeem error:', error)
    return NextResponse.json(
      { error: 'Failed to redeem reward' },
      { status: 500 }
    )
  }
}
