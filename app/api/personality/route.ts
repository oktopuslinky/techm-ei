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

    const [personality, history] = await Promise.all([
      sql`SELECT * FROM personality WHERE user_id = ${user.id}`,
      sql`
        SELECT * FROM personality_history
        WHERE user_id = ${user.id}
        ORDER BY recorded_at DESC
        LIMIT 10
      `,
    ])

    return NextResponse.json({
      current: personality[0] || null,
      history,
    })
  } catch (error) {
    console.error('Personality error:', error)
    return NextResponse.json(
      { error: 'Failed to get personality data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = await request.json()

    // Update current personality
    await sql`
      UPDATE personality
      SET openness = ${openness},
          conscientiousness = ${conscientiousness},
          extraversion = ${extraversion},
          agreeableness = ${agreeableness},
          neuroticism = ${neuroticism},
          updated_at = NOW()
      WHERE user_id = ${user.id}
    `

    // Add to history
    await sql`
      INSERT INTO personality_history (id, user_id, openness, conscientiousness, extraversion, agreeableness, neuroticism)
      VALUES (${uuidv4()}, ${user.id}, ${openness}, ${conscientiousness}, ${extraversion}, ${agreeableness}, ${neuroticism})
    `

    // Mark onboarding as complete if it wasn't already
    if (!user.onboarding_completed) {
      await sql`
        UPDATE users
        SET onboarding_completed = true, updated_at = NOW()
        WHERE id = ${user.id}
      `

      // Award onboarding bonus points
      await sql`
        UPDATE points
        SET total_points = total_points + 50,
            lifetime_points = lifetime_points + 50,
            updated_at = NOW()
        WHERE user_id = ${user.id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update personality error:', error)
    return NextResponse.json(
      { error: 'Failed to update personality' },
      { status: 500 }
    )
  }
}
