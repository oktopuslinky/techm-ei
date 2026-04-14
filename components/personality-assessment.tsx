'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  text: string
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'
}

const assessmentQuestions: Question[] = [
  { id: '1', text: 'I enjoy trying new experiences and exploring unfamiliar places.', trait: 'openness' },
  { id: '2', text: 'I often think about abstract concepts and philosophical ideas.', trait: 'openness' },
  { id: '3', text: 'I appreciate art, music, and creative expression.', trait: 'openness' },
  { id: '4', text: 'I prefer to have a detailed plan before starting any task.', trait: 'conscientiousness' },
  { id: '5', text: 'I always complete my tasks on time and meet deadlines.', trait: 'conscientiousness' },
  { id: '6', text: 'I pay attention to details and strive for accuracy.', trait: 'conscientiousness' },
  { id: '7', text: 'I feel energized when spending time with groups of people.', trait: 'extraversion' },
  { id: '8', text: 'I enjoy being the center of attention in social situations.', trait: 'extraversion' },
  { id: '9', text: 'I often initiate conversations with strangers.', trait: 'extraversion' },
  { id: '10', text: 'I go out of my way to help others, even at my own expense.', trait: 'agreeableness' },
  { id: '11', text: 'I trust others easily and give them the benefit of the doubt.', trait: 'agreeableness' },
  { id: '12', text: 'I prefer cooperation over competition in most situations.', trait: 'agreeableness' },
  { id: '13', text: 'I often worry about things that might go wrong.', trait: 'neuroticism' },
  { id: '14', text: 'I feel stressed easily when facing challenges.', trait: 'neuroticism' },
  { id: '15', text: 'My mood can change quickly throughout the day.', trait: 'neuroticism' },
]

interface PersonalityAssessmentProps {
  onComplete: (scores: Record<string, number>) => void
}

const responseOptions = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
]

export function PersonalityAssessment({ onComplete }: PersonalityAssessmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const currentQuestion = assessmentQuestions[currentIndex]
  const progress = ((currentIndex + 1) / assessmentQuestions.length) * 100
  const currentAnswer = answers[currentQuestion.id]

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const goToNext = () => {
    if (currentIndex < assessmentQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      calculateScores()
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const calculateScores = () => {
    const traitScores: Record<string, number[]> = {
      openness: [],
      conscientiousness: [],
      extraversion: [],
      agreeableness: [],
      neuroticism: [],
    }

    assessmentQuestions.forEach((q) => {
      const answer = answers[q.id]
      if (answer !== undefined) {
        traitScores[q.trait].push(answer)
      }
    })

    const finalScores: Record<string, number> = {}
    for (const trait in traitScores) {
      const scores = traitScores[trait]
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      finalScores[trait] = Math.round((avg / 5) * 100)
    }

    onComplete(finalScores)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {assessmentQuestions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border mb-6">
        <p className="text-lg font-medium text-foreground leading-relaxed text-balance">
          {currentQuestion.text}
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {responseOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className={cn(
              'w-full p-4 rounded-xl border text-left transition-all duration-200',
              currentAnswer === option.value
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted'
            )}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          onClick={goToNext}
          disabled={currentAnswer === undefined}
        >
          {currentIndex === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
          {currentIndex < assessmentQuestions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </div>
  )
}
