'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface PersonalityChartProps {
  data: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
}

export function PersonalityChart({ data }: PersonalityChartProps) {
  const chartData = [
    { trait: 'Openness', value: data.openness, fullMark: 100 },
    { trait: 'Conscientiousness', value: data.conscientiousness, fullMark: 100 },
    { trait: 'Extraversion', value: data.extraversion, fullMark: 100 },
    { trait: 'Agreeableness', value: data.agreeableness, fullMark: 100 },
    { trait: 'Neuroticism', value: data.neuroticism, fullMark: 100 },
  ]

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Personality"
            dataKey="value"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--card-foreground)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
