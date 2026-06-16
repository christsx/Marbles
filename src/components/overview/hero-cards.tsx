import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { TrendPill } from "@/components/overview/metric-card"
import { PanelCard } from "@/components/overview/panel-card"
import { cn } from "@/lib/utils"

type HeroCard = {
  label: string
  value: string
  change?: { trend: "up" | "down"; label: string; invert?: boolean }
  footnote: string
  href: string
}

const cards: HeroCard[] = [
  {
    label: "Shipped this week",
    value: "142",
    change: { trend: "up", label: "+18%" },
    footnote: "vs. 120 last week",
    href: "/dashboard/metrics",
  },
  {
    label: "Merge rate",
    value: "92%",
    change: { trend: "up", label: "+3%" },
    footnote: "first-pass PR approvals",
    href: "/dashboard/code-review",
  },
  {
    label: "Cycle time",
    value: "3.4h",
    change: { trend: "down", label: "-22m", invert: true },
    footnote: "median spec → ship",
    href: "/dashboard/metrics",
  },
]

export function HeroCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.label} href={card.href} className="group block">
          <PanelCard
            className={cn(
              "flex h-full flex-col gap-3 p-5 transition-colors",
              "group-hover:border-foreground/20 group-hover:bg-muted/30"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
            </div>
            <span className="text-[2.25rem] leading-none font-semibold tracking-tight tabular-nums">
              {card.value}
            </span>
            {card.change && (
              <TrendPill trend={card.change.trend} invert={card.change.invert}>
                {card.change.label}
              </TrendPill>
            )}
            <span className="text-xs text-muted-foreground">{card.footnote}</span>
          </PanelCard>
        </Link>
      ))}
    </div>
  )
}
