'use client'

import { useState } from 'react'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AIInsightsCard } from '@/components/ai-insights-card'
import { History, Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Response } from '@/lib/db'

interface HistoryResponse extends Response {
  question_text: string
  category: string
  emotional_state?: string
  sentiment_score?: number
  key_themes?: string[]
  suggestions?: string[]
}

interface HistoryClientProps {
  responses: HistoryResponse[]
}

export function HistoryClient({ responses }: HistoryClientProps) {
  const [selectedResponse, setSelectedResponse] = useState<HistoryResponse | null>(null)

  // Group responses by date
  const groupedResponses = responses.reduce((acc, response) => {
    const date = new Date(response.created_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(response)
    return acc
  }, {} as Record<string, HistoryResponse[]>)

  const getSentimentColor = (score?: number) => {
    if (score === undefined) return 'bg-muted'
    if (score > 0.3) return 'bg-emerald-500'
    if (score < -0.3) return 'bg-rose-500'
    return 'bg-amber-500'
  }

  if (selectedResponse) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-4 py-4 max-w-lg mx-auto">
            <button
              onClick={() => setSelectedResponse(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span className="text-sm">Back to history</span>
            </button>
          </div>
        </header>

        <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(selectedResponse.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <div className="bg-card rounded-2xl p-4 border border-border">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                {selectedResponse.category}
              </span>
              <p className="text-lg font-medium text-foreground mt-3 leading-relaxed">
                {selectedResponse.question_text}
              </p>
            </div>
          </div>

          {selectedResponse.transcript && (
            <div className="bg-card rounded-2xl p-4 border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Your Response</p>
              <p className="text-foreground">{selectedResponse.transcript}</p>
            </div>
          )}

          <AIInsightsCard
            emotionalState={selectedResponse.emotional_state}
            keyThemes={selectedResponse.key_themes}
            suggestions={selectedResponse.suggestions}
          />
        </div>

        <BottomNavigation />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4 max-w-lg mx-auto">
          <h1 className="text-xl font-serif font-bold text-foreground">History</h1>
          <p className="text-sm text-muted-foreground">Your reflection journey</p>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {responses.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No reflections yet</h2>
            <p className="text-muted-foreground">
              Complete your first daily reflection to start building your history.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResponses).map(([date, dateResponses]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground">{date}</h2>
                </div>
                <div className="space-y-3">
                  {dateResponses.map((response) => (
                    <button
                      key={response.id}
                      onClick={() => setSelectedResponse(response)}
                      className="w-full bg-card rounded-2xl p-4 border border-border text-left hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground line-clamp-2">
                            {response.question_text}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                              {response.category}
                            </span>
                            {response.emotional_state && (
                              <span className="text-xs text-muted-foreground capitalize">
                                {response.emotional_state}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-3 h-3 rounded-full',
                              getSentimentColor(response.sentiment_score)
                            )}
                          />
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  )
}
