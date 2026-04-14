'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNavigation } from '@/components/bottom-navigation'
import { StreakWidget } from '@/components/streak-widget'
import { PointsDisplay } from '@/components/points-display'
import { QuestionCard } from '@/components/question-card'
import { VideoRecorder } from '@/components/video-recorder'
import { AIInsightsCard } from '@/components/ai-insights-card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles } from 'lucide-react'
import type { User, Question, Response } from '@/lib/db'

interface HomeClientProps {
  user: User
  question: Question | null
  todayResponse: (Response & {
    question_text: string
    category: string
    emotional_state?: string
    key_themes?: string[]
    suggestions?: string[]
  }) | null
  streak: { current_streak: number; longest_streak: number }
  points: number
}

export function HomeClient({ user, question, todayResponse, streak, points }: HomeClientProps) {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedResponse, setSubmittedResponse] = useState<{
    emotional_state?: string
    key_themes?: string[]
    suggestions?: string[]
  } | null>(todayResponse ? {
    emotional_state: todayResponse.emotional_state,
    key_themes: todayResponse.key_themes,
    suggestions: todayResponse.suggestions,
  } : null)

  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    if (!question) return
    
    setIsSubmitting(true)
    
    try {
      // In a real app, you would upload the video blob to storage here
      // For now, we'll just save the metadata
      
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          durationSeconds: duration,
          transcript: 'Video reflection recorded', // In production, this would be transcribed
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save response')
      }

      const data = await res.json()
      setSubmittedResponse(data.analysis)
      setIsRecording(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to save response:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasCompletedToday = !!todayResponse || !!submittedResponse

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div>
            <p className="text-sm text-muted-foreground">Good {getGreeting()},</p>
            <h1 className="text-lg font-semibold text-foreground">{user.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <PointsDisplay points={points} compact />
            <StreakWidget currentStreak={streak.current_streak} longestStreak={streak.longest_streak} compact />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {hasCompletedToday ? (
          <>
            <div className="bg-primary/10 rounded-2xl p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-serif font-semibold text-foreground mb-2">
                Great job today!
              </h2>
              <p className="text-muted-foreground">
                You&apos;ve completed your daily reflection. Come back tomorrow for a new question.
              </p>
            </div>

            {todayResponse && (
              <div className="bg-card rounded-2xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Today&apos;s question</p>
                <p className="font-medium text-foreground">{todayResponse.question_text}</p>
              </div>
            )}

            <AIInsightsCard
              emotionalState={submittedResponse?.emotional_state || todayResponse?.emotional_state}
              keyThemes={submittedResponse?.key_themes || todayResponse?.key_themes}
              suggestions={submittedResponse?.suggestions || todayResponse?.suggestions}
            />
          </>
        ) : (
          <>
            <StreakWidget currentStreak={streak.current_streak} longestStreak={streak.longest_streak} />

            {question && (
              <>
                <QuestionCard question={question.text} category={question.category} />

                {isRecording ? (
                  <div className="bg-card rounded-2xl p-4 border border-border">
                    <VideoRecorder
                      onRecordingComplete={handleRecordingComplete}
                      maxDuration={120}
                    />
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsRecording(true)}
                    disabled={isSubmitting}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                )}
              </>
            )}

            {!question && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No questions available. Please check back later.</p>
              </div>
            )}
          </>
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Analyzing your reflection...</p>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
