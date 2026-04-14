'use client'

import { BottomNavigation } from '@/components/bottom-navigation'
import { PersonalityChart } from '@/components/personality-chart'
import { EmotionTrendChart } from '@/components/emotion-trend-chart'
import { WeeklySummaryCard } from '@/components/weekly-summary-card'
import { BarChart3, Calendar, MessageSquare, TrendingUp } from 'lucide-react'
import type { Personality, WeeklySummary, Streak } from '@/lib/db'

interface DashboardClientProps {
  emotionTrend: Array<{ date: string; sentiment: number }>
  weeklySummaries: WeeklySummary[]
  stats: { totalResponses: number; activeDays: number }
  topThemes: string[]
  personality: Personality | null
  streak: Streak | null
}

export function DashboardClient({
  emotionTrend,
  weeklySummaries,
  stats,
  topThemes,
  personality,
}: DashboardClientProps) {
  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4 max-w-lg mx-auto">
          <h1 className="text-xl font-serif font-bold text-foreground">Insights</h1>
          <p className="text-sm text-muted-foreground">Your emotional intelligence journey</p>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">Reflections</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalResponses}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Active Days</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.activeDays}</p>
          </div>
        </div>

        {/* Emotional Trend */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Emotional Trend</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Your mood over the last 2 weeks</p>
          </div>
          <div className="p-4">
            {emotionTrend.length > 0 ? (
              <EmotionTrendChart data={emotionTrend} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Complete more reflections to see your emotional trend
              </div>
            )}
          </div>
        </div>

        {/* Personality Profile */}
        {personality && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Personality Profile</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Big Five personality traits</p>
            </div>
            <div className="p-4">
              <PersonalityChart
                data={{
                  openness: personality.openness,
                  conscientiousness: personality.conscientiousness,
                  extraversion: personality.extraversion,
                  agreeableness: personality.agreeableness,
                  neuroticism: personality.neuroticism,
                }}
              />
            </div>
          </div>
        )}

        {/* Top Themes */}
        {topThemes.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h2 className="font-semibold text-foreground mb-3">Your Top Themes</h2>
            <div className="flex flex-wrap gap-2">
              {topThemes.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Summaries */}
        {weeklySummaries.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Weekly Summaries</h2>
            {weeklySummaries.map((summary) => (
              <WeeklySummaryCard
                key={summary.id}
                weekStart={summary.week_start}
                summaryText={summary.summary_text || undefined}
                topThemes={summary.top_themes || undefined}
                recommendations={summary.recommendations || undefined}
              />
            ))}
          </div>
        )}

        {stats.totalResponses === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No data yet</h2>
            <p className="text-muted-foreground">
              Complete your first reflection to start seeing insights about your emotional patterns.
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  )
}
