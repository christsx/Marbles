"use client"

import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { PanelCard } from "@/components/overview/panel-card"
import { cn } from "@/lib/utils"
import {
  activityLevel,
  buildShipActivity,
  buildWeekGrid,
  formatActivityDate,
  totalShipped,
} from "@/lib/ship-activity"

const WEEKS = 26
const CELL = 11
const GAP = 3

const data = buildShipActivity(WEEKS)
const weeks = buildWeekGrid(data)

const levelClass: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-muted",
  1: "bg-chart-1",
  2: "bg-chart-4",
  3: "bg-chart-3",
  4: "bg-chart-5",
}

export function ShipActivityGraph() {
  const total = totalShipped(data)

  return (
    <PanelCard className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading text-base font-medium">Shipping activity</h2>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} work orders merged · last {WEEKS} weeks
          </p>
        </div>
        <Link
          href="/dashboard/metrics"
          className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Metrics
          <ArrowUpRightIcon className="size-3.5" />
        </Link>
      </div>

      <div className="w-full overflow-x-auto pb-1">
        <div
          className="flex w-max shrink-0"
          style={{ gap: GAP }}
          role="img"
          aria-label={`Shipping activity heatmap, ${total} work orders over ${WEEKS} weeks`}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="flex shrink-0 flex-col" style={{ gap: GAP }}>
              {week.map((day, di) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${wi}-${di}`}
                      className="shrink-0"
                      style={{ width: CELL, height: CELL }}
                      aria-hidden
                    />
                  )
                }
                const level = activityLevel(day.count)
                return (
                  <div
                    key={day.date}
                    title={`${formatActivityDate(day.date)} · ${day.count} shipped`}
                    className={cn("shrink-0 rounded-[2px]", levelClass[level])}
                    style={{ width: CELL, height: CELL }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
        <span>Less</span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            className={cn("rounded-[2px]", levelClass[level])}
            style={{ width: CELL, height: CELL }}
          />
        ))}
        <span>More</span>
      </div>
    </PanelCard>
  )
}
