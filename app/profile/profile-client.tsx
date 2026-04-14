'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNavigation } from '@/components/bottom-navigation'
import { StreakWidget } from '@/components/streak-widget'
import { PersonalityChart } from '@/components/personality-chart'
import { Button } from '@/components/ui/button'
import {
  User,
  Mail,
  Calendar,
  Star,
  Flame,
  MessageSquare,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react'
import type { User as UserType, Personality, Points, Streak } from '@/lib/db'

interface ProfileClientProps {
  user: UserType
  personality: Personality | null
  points: Points
  streak: Streak
  stats: { totalResponses: number; activeDays: number }
}

export function ProfileClient({ user, personality, points, streak, stats }: ProfileClientProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* User Info */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since {memberSince}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-xs font-medium">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{points.total_points?.toLocaleString() || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime: {points.lifetime_points?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">Reflections</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalResponses}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeDays} active days
            </p>
          </div>
        </div>

        {/* Streak */}
        <StreakWidget
          currentStreak={streak.current_streak || 0}
          longestStreak={streak.longest_streak || 0}
        />

        {/* Personality */}
        {personality && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Personality Profile</h3>
                <p className="text-sm text-muted-foreground">Big Five traits</p>
              </div>
              <Button variant="ghost" size="sm">
                Retake
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
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

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          ReflectAI v1.0.0
        </p>
      </div>

      <BottomNavigation />
    </main>
  )
}
