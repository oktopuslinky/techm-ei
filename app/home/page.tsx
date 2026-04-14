import { sql } from '@/lib/db'
import { HomeClient } from './home-client'

// TESTING MODE: Using mock user data
// TODO: Restore actual auth for production
const MOCK_USER = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  onboarding_completed: true,
  created_at: new Date().toISOString(),
}

export default async function HomePage() {
  // TESTING MODE: Skip auth check
  const user = MOCK_USER

  // Get a random question from the database
  let questionData = null
  
  try {
    const questions = await sql`
      SELECT * FROM questions
      WHERE is_active = true
      ORDER BY RANDOM()
      LIMIT 1
    `
    if (questions.length > 0) {
      questionData = questions[0]
    }
  } catch (error) {
    console.error('Failed to fetch question:', error)
  }

  return (
    <HomeClient
      user={user}
      question={questionData}
      todayResponse={null}
      streak={{ current_streak: 5, longest_streak: 12 }}
      points={250}
    />
  )
}
