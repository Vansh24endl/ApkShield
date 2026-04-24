'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { ShieldAlert } from 'lucide-react'

interface SeverityChartProps {
  critical: number
  high: number
  medium: number
  low: number
}

const COLORS = {
  Critical: '#ef4444', // red-500
  High: '#f97316',     // orange-500
  Medium: '#eab308',   // yellow-500
  Low: '#22c55e'       // green-500
}

export function SeverityChart({ critical, high, medium, low }: SeverityChartProps) {
  const data = [
    { name: 'Critical', value: critical },
    { name: 'High', value: high },
    { name: 'Medium', value: medium },
    { name: 'Low', value: low },
  ].filter(item => item.value > 0) // Only show non-zero values

  const hasData = data.length > 0

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col">
      <h2 className="mb-4 flex items-center gap-2 font-semibold">
        <ShieldAlert className="h-5 w-5 text-muted-foreground" />
        Vulnerability Distribution
      </h2>
      
      <div className="h-[250px] w-full relative flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="rgba(255,255,255,0.05)"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                    className="drop-shadow-lg transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 10, 15, 0.9)', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground h-full">
            <div className="h-16 w-16 rounded-full border-4 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
              <ShieldAlert className="h-6 w-6 opacity-30" />
            </div>
            <p className="text-sm">No vulnerabilities found yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
