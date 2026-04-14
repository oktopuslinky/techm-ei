'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PointsDisplayProps {
  points: number
  compact?: boolean
  className?: string
}

export function PointsDisplay({ points, compact = false, className }: PointsDisplayProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground', className)}>
        <Star className="h-4 w-4 fill-accent text-accent" />
        <span className="text-sm font-semibold">{points.toLocaleString()}</span>
      </div>
    )
  }

  return (
    <div className={cn('bg-card rounded-2xl p-4 border border-border', className)}>
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-accent/20">
          <Star className="h-6 w-6 fill-accent text-accent" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{points.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total points</p>
        </div>
      </div>
    </div>
  )
}
