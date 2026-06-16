"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export type HistoricalPeriod = "30d" | "90d" | "12m"

const datasets: Record<HistoricalPeriod, { label: string; revenue: number }[]> = {
  "30d": [
    { label: "W1", revenue: 54 },
    { label: "W2", revenue: 61 },
    { label: "W3", revenue: 58 },
    { label: "W4", revenue: 72 },
  ],
  "90d": [
    { label: "Apr", revenue: 207 },
    { label: "May", revenue: 232 },
    { label: "Jun", revenue: 248 },
  ],
  "12m": [
    { label: "Jul", revenue: 168 },
    { label: "Aug", revenue: 175 },
    { label: "Sep", revenue: 182 },
    { label: "Oct", revenue: 190 },
    { label: "Nov", revenue: 205 },
    { label: "Dec", revenue: 221 },
    { label: "Jan", revenue: 182 },
    { label: "Feb", revenue: 198 },
    { label: "Mar", revenue: 215 },
    { label: "Apr", revenue: 207 },
    { label: "May", revenue: 232 },
    { label: "Jun", revenue: 248 },
  ],
}

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function HistoricalChart({ period }: { period: HistoricalPeriod }) {
  const data = datasets[period]
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <LineChart data={data} margin={{ left: 4, right: 12, top: 16 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={56}
          tickFormatter={(value) => `$${value}k`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <span className="flex w-full items-center justify-between gap-3">
                  <span className="text-muted-foreground capitalize">{name}</span>
                  <span className="font-mono font-medium tabular-nums">
                    ${value}k
                  </span>
                </span>
              )}
            />
          }
        />
        <Line
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
