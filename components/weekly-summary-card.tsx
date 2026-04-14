'use client'

import { Calendar, TrendingUp, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeeklySummaryCardProps {
  weekStart: string
  summaryText?: string
  topThemes?: string[]
  recommendations?: string[]
  className?: string
}

export function WeeklySummaryCard({
  weekStart,
  summaryText,
  topThemes = [],
  recommendations = [],
  className,
}: WeeklySummaryCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  return (
    <div className={cn('bg-card rounded-2xl border border-border overflow-hidden', className)}>
      <div className="p-4 bg-gradient-to-r from-secondary to-muted border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Week of {formatDate(weekStart)} - {formatDate(weekEnd.toISOString())}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {summaryText && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Summary</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{summaryText}</p>
          </div>
        )}

        {topThemes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Top Themes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {topThemes.map((theme, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Recommendations</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!summaryText && topThemes.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Complete more reflections to generate your weekly summary
          </p>
        )}
      </div>
    </div>
  )
}
