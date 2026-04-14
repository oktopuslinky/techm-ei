import { HistoryClient } from './history-client'

// TESTING MODE: Using mock data
// TODO: Restore actual data fetching for production

export default async function HistoryPage() {
  // Mock responses
  const mockResponses = [
    {
      id: '1',
      question_text: 'What moment today made you feel most alive?',
      category: 'self-reflection',
      created_at: new Date('2026-04-13T10:30:00').toISOString(),
      emotional_state: 'Grateful',
      sentiment_score: 0.78,
      key_themes: ['gratitude', 'connection', 'mindfulness'],
      duration_seconds: 85,
    },
    {
      id: '2',
      question_text: 'How did you handle a challenge this week?',
      category: 'growth',
      created_at: new Date('2026-04-12T09:15:00').toISOString(),
      emotional_state: 'Confident',
      sentiment_score: 0.72,
      key_themes: ['resilience', 'problem-solving', 'self-belief'],
      duration_seconds: 120,
    },
    {
      id: '3',
      question_text: 'What relationship are you most grateful for right now?',
      category: 'relationships',
      created_at: new Date('2026-04-11T11:00:00').toISOString(),
      emotional_state: 'Loved',
      sentiment_score: 0.85,
      key_themes: ['family', 'appreciation', 'support'],
      duration_seconds: 95,
    },
    {
      id: '4',
      question_text: 'What fear would you like to overcome?',
      category: 'self-reflection',
      created_at: new Date('2026-04-10T08:45:00').toISOString(),
      emotional_state: 'Hopeful',
      sentiment_score: 0.62,
      key_themes: ['vulnerability', 'growth', 'courage'],
      duration_seconds: 110,
    },
  ]

  return <HistoryClient responses={mockResponses} />
}
