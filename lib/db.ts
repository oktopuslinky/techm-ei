import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  age_group: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type Personality = {
  id: string
  user_id: string
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  updated_at: string
}

export type Question = {
  id: string
  text: string
  category: string
  personality_trait: string | null
  is_active: boolean
}

export type Response = {
  id: string
  user_id: string
  question_id: string
  video_url: string | null
  transcript: string | null
  duration_seconds: number | null
  created_at: string
}

export type AIAnalysis = {
  id: string
  response_id: string
  emotional_state: string | null
  sentiment_score: number | null
  key_themes: string[] | null
  personality_insights: Record<string, unknown> | null
  suggestions: string[] | null
  created_at: string
}

export type Points = {
  id: string
  user_id: string
  total_points: number
  lifetime_points: number
  updated_at: string
}

export type Reward = {
  id: string
  name: string
  description: string
  points_required: number
  category: string
  image_url: string | null
  is_active: boolean
}

export type Streak = {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  updated_at: string
}

export type WeeklySummary = {
  id: string
  user_id: string
  week_start: string
  summary_text: string | null
  emotional_trends: Record<string, unknown> | null
  top_themes: string[] | null
  recommendations: string[] | null
  created_at: string
}
