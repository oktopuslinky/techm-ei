'use client'

import { Sparkles, TrendingUp, Lightbulb, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIInsightsCardProps {
  emotionalState?: string
  keyThemes?: string[]
  suggestions?: string[]
  className?: string
}

export function AIInsightsCard({
  emotionalState,
  keyThemes = [],
  suggestions = [],
  className,
}: AIInsightsCardProps) {
  return (
    <div className={cn('bg-card rounded-2xl border border-border overflow-hidden', className)}>
      <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Insights</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {emotionalState && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Heart className="h-4 w-4 text-pink-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Emotional State</p>
              <p className="text-sm text-muted-foreground capitalize">{emotionalState}</p>
            </div>
          </div>
        )}

        {keyThemes.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Key Themes</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {keyThemes.map((theme, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Lightbulb className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Suggestions</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!emotionalState && keyThemes.length === 0 && suggestions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Complete today&apos;s reflection to receive AI-powered insights
          </p>
        )}
      </div>
    </div>
  )
}
