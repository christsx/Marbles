import Link from "next/link"

import { PanelCard } from "@/components/overview/panel-card"
import { StatusBadge, type StatusTone } from "@/components/status-badge"

type Status = "Open" | "In progress" | "In review"

type Item = {
  title: string
  context: string
  status: Status
}

const items: Item[] = [
  { title: "WO-1835 — flaky websocket reconnect test", context: "Nova · web-app · Test", status: "Open" },
  { title: "WO-1828 blocked on blueprint approval", context: "Echo · core-api · Blueprint", status: "Open" },
  { title: "Coverage gate failing on billing-svc", context: "Orion · 74% on changed lines", status: "In review" },
  { title: "2 agents below baseline need calibration", context: "Echo, Sol · Fleet", status: "In progress" },
]

const toneMap: Record<Status, StatusTone> = {
  Open: "error",
  "In progress": "warning",
  "In review": "info",
}

export function NeedsAttention() {
  return (
    <PanelCard className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold">Needs attention</h2>
          <p className="text-sm text-muted-foreground">Exceptions across all phases</p>
        </div>
        <Link
          href="/dashboard/code-review"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <ul className="flex flex-1 flex-col border-t border-border">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5 last:border-b-0"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.context}</span>
            </div>
            <StatusBadge tone={toneMap[item.status]}>{item.status}</StatusBadge>
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
