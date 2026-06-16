"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", revenue: 182, forecast: 190, goal: 200 },
  { month: "Feb", revenue: 198, forecast: 205, goal: 210 },
  { month: "Mar", revenue: 215, forecast: 220, goal: 220 },
  { month: "Apr", revenue: 207, forecast: 225, goal: 230 },
  { month: "May", revenue: 232, forecast: 240, goal: 240 },
  { month: "Jun", revenue: 248, forecast: 262, goal: 250 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  forecast: { label: "Forecast", color: "var(--chart-3)" },
  goal: { label: "Goal", color: "var(--chart-5)" },
} satisfies ChartConfig

export function RevenueTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={data} margin={{ left: 4, right: 12, top: 16 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
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
                      <span className="text-muted-foreground capitalize">
                        {name}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        ${value}k
                      </span>
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="forecast"
              type="monotone"
              stroke="var(--color-forecast)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              dataKey="goal"
              type="monotone"
              stroke="var(--color-goal)"
              strokeWidth={1.5}
              strokeDasharray="2 4"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
