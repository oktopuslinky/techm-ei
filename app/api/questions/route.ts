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

    // Get today's date in user's timezone (simplified to UTC)
    const today = new Date().toISOString().split('T')[0]

    // Check if user already answered today
    const todayResponses = await sql`
      SELECT r.*, q.text as question_text, q.category
      FROM responses r
      JOIN questions q ON r.question_id = q.id
      WHERE r.user_id = ${user.id}
        AND DATE(r.created_at) = ${today}
      ORDER BY r.created_at DESC
      LIMIT 1
    `

    if (todayResponses.length > 0) {
      return NextResponse.json({
        alreadyAnswered: true,
        todayResponse: todayResponses[0],
      })
    }

    // Get a random question the user hasn't answered recently
    const recentQuestionIds = await sql`
      SELECT DISTINCT question_id FROM responses
      WHERE user_id = ${user.id}
        AND created_at > NOW() - INTERVAL '7 days'
    `

    const excludeIds = recentQuestionIds.map((r) => r.question_id)

    let questions
    if (excludeIds.length > 0) {
      questions = await sql`
        SELECT * FROM questions
        WHERE is_active = true
          AND id != ALL(${excludeIds})
        ORDER BY RANDOM()
        LIMIT 1
      `
    }

    // If no questions available (all asked recently), get any random question
    if (!questions || questions.length === 0) {
      questions = await sql`
        SELECT * FROM questions
        WHERE is_active = true
        ORDER BY RANDOM()
        LIMIT 1
      `
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions available' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      alreadyAnswered: false,
      question: questions[0],
    })
  } catch (error) {
    console.error('Questions error:', error)
    return NextResponse.json(
      { error: 'Failed to get question' },
      { status: 500 }
    )
  }
}
