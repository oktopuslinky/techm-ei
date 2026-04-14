import { ProfileClient } from './profile-client'

// TESTING MODE: Using mock data
// TODO: Restore actual auth and data fetching for production

const MOCK_USER = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  onboarding_completed: true,
  created_at: new Date('2026-03-15').toISOString(),
}

export default async function ProfilePage() {
  // Mock personality
  const mockPersonality = {
    openness: 75,
    conscientiousness: 68,
    extraversion: 52,
    agreeableness: 81,
    neuroticism: 35,
  }

  return (
    <ProfileClient
      user={MOCK_USER}
      personality={mockPersonality}
      points={{ total_points: 250, lifetime_points: 450 }}
      streak={{ current_streak: 5, longest_streak: 12 }}
      stats={{
        totalResponses: 24,
        activeDays: 18,
      }}
    />
  )
}
