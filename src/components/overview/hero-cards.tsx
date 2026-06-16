import Link from "next/link"

import { TrendPill } from "@/components/overview/metric-card"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

type HeroCard = {
  label: string
  value: string
  change?: { trend: "up" | "down"; label: string }
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
    change: { trend: "down", label: "-22m" },
    footnote: "median spec → ship",
    href: "/dashboard/metrics",
  },
]

export function HeroCards() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.label} href={card.href} className="block h-full">
          <Card size="sm" className="aspect-video h-full">
            <CardHeader>
              <CardDescription className="text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase">
                {card.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <span className="text-[2.25rem] leading-none font-semibold tracking-tight tabular-nums">
                {card.value}
              </span>
              {card.change && (
                <TrendPill trend={card.change.trend}>{card.change.label}</TrendPill>
              )}
              <span className="text-xs text-muted-foreground/80">{card.footnote}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
