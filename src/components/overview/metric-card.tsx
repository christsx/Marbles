import * as React from "react"
import Link from "next/link"
import { ArrowDownIcon, ArrowUpIcon, ArrowUpRightIcon } from "lucide-react"

import { PanelCard } from "@/components/overview/panel-card"
import { cn } from "@/lib/utils"

type Trend = "up" | "down" | "flat"

export function TrendPill({
  trend,
  children,
  invert = false,
}: {
  trend: Trend
  children: React.ReactNode
  invert?: boolean
}) {
  const good =
    invert ? trend === "down" || trend === "flat" : trend === "up" || trend === "flat"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
        good && "text-emerald-600 dark:text-emerald-400",
        !good && trend !== "flat" && "text-rose-600 dark:text-rose-400",
        trend === "flat" && !invert && "text-muted-foreground"
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
  href,
}: {
  label: string
  value: string
  change?: { trend: Trend; label: string }
  footnote?: React.ReactNode
  href?: string
}) {
  const card = (
    <PanelCard
      className={cn(
        "flex h-full flex-col gap-2 p-4",
        href && "transition-colors group-hover:border-foreground/20 group-hover:bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {href && (
          <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
        )}
      </div>
      <span className="text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      {change && (
        <div>
          <TrendPill trend={change.trend}>{change.label}</TrendPill>
        </div>
      )}
      {footnote && (
        <div className="text-xs text-muted-foreground">{footnote}</div>
      )}
    </PanelCard>
  )

  if (href) {
    return (
      <Link href={href} className="group block h-full">
        {card}
      </Link>
    )
  }

  return card
}
