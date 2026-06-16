"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { offer: "Done-For-You", revenue: 128 },
  { offer: "Accelerator", revenue: 96 },
  { offer: "Coaching", revenue: 64 },
  { offer: "Workshop", revenue: 38 },
  { offer: "Audit", revenue: 22 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function RevenueByOfferChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart data={data} margin={{ left: 4, right: 12, top: 16 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="offer" tickLine={false} axisLine={false} tickMargin={8} />
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
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
      </BarChart>
    </ChartContainer>
  )
}
