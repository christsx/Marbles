"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { month: "Apr", actual: 207, forecast: 207 },
  { month: "May", actual: 232, forecast: 232 },
  { month: "Jun", actual: 248, forecast: 248 },
  { month: "Jul", actual: null, forecast: 274 },
  { month: "Aug", actual: null, forecast: 298 },
  { month: "Sep", actual: null, forecast: 325 },
]

const chartConfig = {
  actual: { label: "Actual", color: "var(--chart-1)" },
  forecast: { label: "Forecast", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ForecastChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 12, top: 16 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
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
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="forecast"
          type="monotone"
          fill="var(--color-forecast)"
          fillOpacity={0.1}
          stroke="var(--color-forecast)"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <Area
          dataKey="actual"
          type="monotone"
          fill="var(--color-actual)"
          fillOpacity={0.2}
          stroke="var(--color-actual)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
