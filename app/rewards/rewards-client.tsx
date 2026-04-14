'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNavigation } from '@/components/bottom-navigation'
import { PointsDisplay } from '@/components/points-display'
import { RewardCard } from '@/components/reward-card'
import { Gift, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Reward } from '@/lib/db'

interface Redemption {
  id: string
  reward_id: string
  reward_name: string
  category: string
  points_spent: number
  redeemed_at: string
}

interface RewardsClientProps {
  rewards: Reward[]
  redemptions: Redemption[]
  currentPoints: number
  lifetimePoints: number
}

export function RewardsClient({ rewards, redemptions, currentPoints, lifetimePoints }: RewardsClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'available' | 'redeemed'>('available')
  const [isRedeeming, setIsRedeeming] = useState(false)

  const handleRedeem = async (rewardId: string) => {
    setIsRedeeming(true)
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to redeem reward')
      }

      router.refresh()
    } catch (error) {
      console.error('Redeem error:', error)
    } finally {
      setIsRedeeming(false)
    }
  }

  const categoryIcons: Record<string, string> = {
    meditation: '🧘',
    wellness: '💆',
    learning: '📚',
    entertainment: '🎬',
    fitness: '💪',
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4 max-w-lg mx-auto">
          <h1 className="text-xl font-serif font-bold text-foreground">Rewards</h1>
          <p className="text-sm text-muted-foreground">Redeem your earned points</p>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Points Summary */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Points</p>
              <p className="text-3xl font-bold text-foreground">{currentPoints.toLocaleString()}</p>
            </div>
            <PointsDisplay points={currentPoints} compact />
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Lifetime points earned: {lifetimePoints.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab('available')}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'available'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Gift className="h-4 w-4 inline mr-2" />
            Available
          </button>
          <button
            onClick={() => setActiveTab('redeemed')}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'redeemed'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Clock className="h-4 w-4 inline mr-2" />
            Redeemed
          </button>
        </div>

        {/* Content */}
        {activeTab === 'available' ? (
          <div className="space-y-4">
            {rewards.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No rewards available yet</p>
              </div>
            ) : (
              rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  name={reward.name}
                  description={reward.description}
                  pointsRequired={reward.points_required}
                  category={reward.category}
                  imageUrl={reward.image_url || undefined}
                  currentPoints={currentPoints}
                  onRedeem={() => handleRedeem(reward.id)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {redemptions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No redemptions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Redeem your first reward to see it here
                </p>
              </div>
            ) : (
              redemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="bg-card rounded-2xl p-4 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{categoryIcons[redemption.category] || '🎁'}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{redemption.reward_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(redemption.redeemed_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        -{redemption.points_spent.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isRedeeming && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Redeeming reward...</p>
          </div>
        </div>
      )}

      <BottomNavigation />
    </main>
  )
}
