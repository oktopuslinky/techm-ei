import { DashboardClient } from './dashboard-client'

// TESTING MODE: Using mock data
// TODO: Restore actual data fetching for production

export default async function DashboardPage() {
  // Mock emotion trend data
  const mockEmotionTrend = [
    { date: 'Apr 7', sentiment: 0.65 },
    { date: 'Apr 8', sentiment: 0.72 },
    { date: 'Apr 9', sentiment: 0.58 },
    { date: 'Apr 10', sentiment: 0.81 },
    { date: 'Apr 11', sentiment: 0.75 },
    { date: 'Apr 12', sentiment: 0.68 },
    { date: 'Apr 13', sentiment: 0.78 },
  ]

  // Mock weekly summaries
  const mockWeeklySummaries = [
    {
      id: '1',
      week_start: new Date('2026-04-07').toISOString(),
      summary_text: 'This week you showed strong self-reflection skills. You explored themes of personal growth and relationships.',
      key_insights: ['Increased emotional awareness', 'Better stress management', 'More positive outlook'],
      avg_sentiment: 0.72,
    },
  ]

  // Mock top themes
  const mockTopThemes = ['Personal Growth', 'Relationships', 'Work-Life Balance', 'Gratitude', 'Self-Care']

  // Mock personality
  const mockPersonality = {
    openness: 75,
    conscientiousness: 68,
    extraversion: 52,
    agreeableness: 81,
    neuroticism: 35,
  }

  return (
    <DashboardClient
      emotionTrend={mockEmotionTrend}
      weeklySummaries={mockWeeklySummaries}
      stats={{
        totalResponses: 24,
        activeDays: 18,
      }}
      topThemes={mockTopThemes}
      personality={mockPersonality}
      streak={{ current_streak: 5, longest_streak: 12 }}
    />
  )
}
