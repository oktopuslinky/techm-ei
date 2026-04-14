'use client'

import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakWidgetProps {
  currentStreak: number
  longestStreak: number
  compact?: boolean
}

export function StreakWidget({ currentStreak, longestStreak, compact = false }: StreakWidgetProps) {
  const streakLevel = currentStreak >= 30 ? 'legendary' : currentStreak >= 14 ? 'hot' : currentStreak >= 7 ? 'warming' : 'starting'
  
  const colors = {
    legendary: 'text-amber-500 bg-amber-500/10',
    hot: 'text-orange-500 bg-orange-500/10',
    warming: 'text-yellow-500 bg-yellow-500/10',
    starting: 'text-muted-foreground bg-muted',
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full', colors[streakLevel])}>
        <Flame className="h-4 w-4" />
        <span className="text-sm font-semibold">{currentStreak}</span>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('p-3 rounded-xl', colors[streakLevel])}>
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</p>
            <p className="text-sm text-muted-foreground">Current streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-foreground">{longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best streak</p>
        </div>
      </div>
      {currentStreak > 0 && (
        <div className="mt-4">
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors',
                  i < (currentStreak % 7 || 7) ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {7 - (currentStreak % 7 || 7)} more days to next milestone
          </p>
        </div>
      )}
    </div>
  )
}
