import * as React from "react"
import Link from "next/link"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { PanelCard } from "@/components/overview/panel-card"
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
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground tabular-nums">
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
    <PanelCard className="flex h-full flex-col gap-2 p-5">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </span>
      {change && (
        <TrendPill trend={change.trend}>{change.label}</TrendPill>
      )}
      {footnote && (
        <div className="text-xs text-muted-foreground">{footnote}</div>
      )}
    </PanelCard>
  )

  if (href) {
    const linkClass = "block h-full transition-opacity hover:opacity-90"
    const isExternal = href.startsWith("http")

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          {card}
        </a>
      )
    }

    return (
      <Link href={href} className={linkClass}>
        {card}
      </Link>
    )
  }

  return card
}
