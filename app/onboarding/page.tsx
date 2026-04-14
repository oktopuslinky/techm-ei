'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PersonalityAssessment } from '@/components/personality-assessment'
import { Sparkles, ChevronRight, Brain, Target, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  {
    title: 'Welcome to ReflectAI',
    description: 'Your personal AI-powered emotional intelligence companion',
    icon: Sparkles,
  },
  {
    title: 'Daily Reflections',
    description: 'Answer one thoughtful question each day through video journaling',
    icon: Brain,
  },
  {
    title: 'Track Your Growth',
    description: 'Watch your emotional patterns and personality insights evolve over time',
    icon: Target,
  },
  {
    title: 'Earn Rewards',
    description: 'Build streaks and earn points to unlock exclusive wellness rewards',
    icon: Trophy,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [showAssessment, setShowAssessment] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setShowAssessment(true)
    }
  }

  const handleAssessmentComplete = async (scores: Record<string, number>) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/personality', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores),
      })

      if (!res.ok) {
        throw new Error('Failed to save personality')
      }

      router.push('/home')
    } catch (error) {
      console.error('Failed to save personality:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showAssessment) {
    return (
      <main className="min-h-screen bg-background p-6 pb-24">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-foreground">Personality Assessment</h1>
            <p className="text-muted-foreground mt-2">
              Help us understand you better with this quick assessment
            </p>
          </div>

          <PersonalityAssessment onComplete={handleAssessmentComplete} />

          {isSubmitting && (
            <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Setting up your profile...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }

  const CurrentIcon = steps[currentStep].icon

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div
            className={cn(
              'inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 transition-all duration-500',
              'bg-gradient-to-br from-primary/20 to-accent/20'
            )}
          >
            <CurrentIcon className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-foreground mb-4 text-balance">
            {steps[currentStep].title}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-balance">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      <div className="p-6 pb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
              )}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full"
          size="lg"
        >
          {currentStep === steps.length - 1 ? 'Start Assessment' : 'Continue'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {currentStep < steps.length - 1 && (
          <button
            onClick={() => setShowAssessment(true)}
            className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip introduction
          </button>
        )}
      </div>
    </main>
  )
}
