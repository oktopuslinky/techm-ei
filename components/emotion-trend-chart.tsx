'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface EmotionTrendChartProps {
  data: Array<{
    date: string
    sentiment: number
    label?: string
  }>
}

export function EmotionTrendChart({ data }: EmotionTrendChartProps) {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            domain={[-1, 1]}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            tickFormatter={(value) => (value > 0 ? '+' : '') + value.toFixed(1)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--card-foreground)',
            }}
            formatter={(value: number) => [
              value > 0 ? 'Positive' : value < 0 ? 'Negative' : 'Neutral',
              'Mood',
            ]}
          />
          <Area
            type="monotone"
            dataKey="sentiment"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#sentimentGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
