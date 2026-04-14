'use client'

import { Star, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RewardCardProps {
  name: string
  description: string
  pointsRequired: number
  category: string
  imageUrl?: string
  currentPoints: number
  onRedeem?: () => void
}

const categoryIcons: Record<string, string> = {
  meditation: '🧘',
  wellness: '💆',
  learning: '📚',
  entertainment: '🎬',
  fitness: '💪',
}

export function RewardCard({
  name,
  description,
  pointsRequired,
  category,
  currentPoints,
  onRedeem,
}: RewardCardProps) {
  const canRedeem = currentPoints >= pointsRequired
  const progress = Math.min((currentPoints / pointsRequired) * 100, 100)

  return (
    <div className={cn(
      'bg-card rounded-2xl p-4 border border-border transition-all duration-200',
      canRedeem ? 'hover:shadow-md hover:border-primary/30' : 'opacity-80'
    )}>
      <div className="flex items-start gap-4">
        <div className="text-3xl">{categoryIcons[category] || '🎁'}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">{currentPoints.toLocaleString()} / {pointsRequired.toLocaleString()}</span>
              <div className="flex items-center gap-1 text-accent-foreground">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <span className="font-medium">{pointsRequired.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  canRedeem ? 'bg-primary' : 'bg-primary/50'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button
            size="sm"
            onClick={onRedeem}
            disabled={!canRedeem}
            className="mt-3 w-full"
            variant={canRedeem ? 'default' : 'secondary'}
          >
            {canRedeem ? (
              'Redeem Now'
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                {(pointsRequired - currentPoints).toLocaleString()} more points
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
