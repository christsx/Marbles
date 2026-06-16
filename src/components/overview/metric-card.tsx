import * as React from "react"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Trend = "up" | "down" | "flat"

export function TrendPill({
  trend,
  children,
}: {
  trend: Trend
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
        trend === "up" && "text-emerald-600 dark:text-emerald-400",
        trend === "down" && "text-rose-600 dark:text-rose-400",
        trend === "flat" && "text-muted-foreground"
      )}
    >
      {trend === "up" && <ArrowUpIcon className="size-3" />}
      {trend === "down" && <ArrowDownIcon className="size-3" />}
      {children}
    </span>
  )
}

export function MetricCard({
  label,
  value,
  change,
  footnote,
}: {
  label: string
  value: string
  change?: { trend: Trend; label: string }
  footnote?: React.ReactNode
}) {
  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <CardDescription className="text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="text-[2.25rem] leading-none font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        {change && (
          <div>
            <TrendPill trend={change.trend}>{change.label}</TrendPill>
          </div>
        )}
        {footnote && (
          <div className="text-xs text-muted-foreground/80">{footnote}</div>
        )}
      </CardContent>
    </Card>
  )
}
