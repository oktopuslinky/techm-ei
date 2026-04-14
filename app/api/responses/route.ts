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

    const responses = await sql`
      SELECT r.*, q.text as question_text, q.category,
             a.emotional_state, a.sentiment_score, a.key_themes, a.suggestions
      FROM responses r
      JOIN questions q ON r.question_id = q.id
      LEFT JOIN ai_analysis a ON r.id = a.response_id
      WHERE r.user_id = ${user.id}
      ORDER BY r.created_at DESC
      LIMIT 30
    `

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Responses error:', error)
    return NextResponse.json(
      { error: 'Failed to get responses' },
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

    const { questionId, transcript, durationSeconds } = await request.json()

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    const responseId = uuidv4()
    
    // Create response
    await sql`
      INSERT INTO responses (id, user_id, question_id, transcript, duration_seconds)
      VALUES (${responseId}, ${user.id}, ${questionId}, ${transcript || null}, ${durationSeconds || null})
    `

    // Generate mock AI analysis (in production, this would call an AI service)
    const analysisId = uuidv4()
    const emotionalStates = ['happy', 'reflective', 'grateful', 'calm', 'hopeful', 'thoughtful']
    const mockAnalysis = {
      emotional_state: emotionalStates[Math.floor(Math.random() * emotionalStates.length)],
      sentiment_score: Math.random() * 2 - 1, // -1 to 1
      key_themes: ['self-reflection', 'personal growth', 'mindfulness'].slice(0, Math.floor(Math.random() * 3) + 1),
      suggestions: [
        'Try to incorporate this reflection practice daily',
        'Consider journaling your thoughts after video reflections',
      ],
    }

    await sql`
      INSERT INTO ai_analysis (id, response_id, emotional_state, sentiment_score, key_themes, suggestions)
      VALUES (
        ${analysisId},
        ${responseId},
        ${mockAnalysis.emotional_state},
        ${mockAnalysis.sentiment_score},
        ${JSON.stringify(mockAnalysis.key_themes)},
        ${JSON.stringify(mockAnalysis.suggestions)}
      )
    `

    // Award points (10 base + 5 bonus for streak)
    const pointsToAward = 10

    await sql`
      UPDATE points
      SET total_points = total_points + ${pointsToAward},
          lifetime_points = lifetime_points + ${pointsToAward},
          updated_at = NOW()
      WHERE user_id = ${user.id}
    `

    // Update streak
    const today = new Date().toISOString().split('T')[0]
    const streakData = await sql`
      SELECT * FROM streaks WHERE user_id = ${user.id}
    `

    if (streakData.length > 0) {
      const streak = streakData[0]
      const lastActivity = streak.last_activity_date
      let newStreak = 1

      if (lastActivity) {
        const lastDate = new Date(lastActivity)
        const todayDate = new Date(today)
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
          newStreak = streak.current_streak
        } else if (diffDays === 1) {
          newStreak = streak.current_streak + 1
        }
      }

      const longestStreak = Math.max(streak.longest_streak, newStreak)

      await sql`
        UPDATE streaks
        SET current_streak = ${newStreak},
            longest_streak = ${longestStreak},
            last_activity_date = ${today},
            updated_at = NOW()
        WHERE user_id = ${user.id}
      `
    }

    return NextResponse.json({
      response: { id: responseId },
      analysis: mockAnalysis,
      pointsAwarded: pointsToAward,
    })
  } catch (error) {
    console.error('Create response error:', error)
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    )
  }
}
