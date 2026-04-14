'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: string
  category: string
  className?: string
}

const categoryColors: Record<string, string> = {
  emotional: 'bg-pink-500/10 text-pink-600',
  growth: 'bg-emerald-500/10 text-emerald-600',
  relationships: 'bg-blue-500/10 text-blue-600',
  gratitude: 'bg-amber-500/10 text-amber-600',
  reflection: 'bg-indigo-500/10 text-indigo-600',
}

export function QuestionCard({ question, category, className }: QuestionCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 border border-primary/20',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className={cn('text-xs font-medium px-2 py-1 rounded-full', categoryColors[category] || 'bg-muted text-muted-foreground')}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
        
        <h2 className="text-xl font-serif font-semibold text-foreground leading-relaxed text-balance">
          {question}
        </h2>
        
        <p className="text-sm text-muted-foreground mt-4">
          Take a moment to reflect and share your thoughts
        </p>
      </div>
    </div>
  )
}
