import { sql } from '@/lib/db'
import { RewardsClient } from './rewards-client'

// TESTING MODE: Using mock user data
// TODO: Restore actual auth for production

export default async function RewardsPage() {
  // Fetch real rewards from database
  let rewards = []
  try {
    rewards = await sql`SELECT * FROM rewards WHERE is_active = true ORDER BY points_required ASC`
  } catch (error) {
    console.error('Failed to fetch rewards:', error)
  }

  // Mock redemptions
  const mockRedemptions = [
    {
      id: '1',
      reward_name: 'Guided Meditation Session',
      category: 'Wellness',
      points_spent: 100,
      redeemed_at: new Date('2026-04-05').toISOString(),
    },
  ]

  return (
    <RewardsClient
      rewards={rewards}
      redemptions={mockRedemptions}
      currentPoints={250}
      lifetimePoints={450}
    />
  )
}
