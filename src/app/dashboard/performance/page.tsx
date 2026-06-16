import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { ScorePill } from "@/components/score-pill"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { opportunitiesByView } from "@/lib/opportunities"

const followUps = [
  { type: "Call", target: "Northwind — Q3 Platform", time: "10:30 AM", overdue: false },
  { type: "Email", target: "Acme Corp — Enterprise", time: "11:15 AM", overdue: false },
  { type: "Text", target: "Initech — Renewal", time: "1:00 PM", overdue: false },
  { type: "Call", target: "Globex — Multi-seat", time: "Overdue 2d", overdue: true },
  { type: "Email", target: "Umbrella — Pilot", time: "Overdue 3d", overdue: true },
]

export default function PerformanceDashboardPage() {
  const queue = opportunitiesByView("today").slice(0, 4)

  return (
    <DashboardShell
      breadcrumb={[{ label: "Performance" }, { label: "Main Dashboard" }]}
    >
      <PageContainer>
        <PageHeader
          title="Main Dashboard"
          subtitle="Your performance and what to work on right now."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Revenue (MTD)" value="$62,400" change={{ trend: "up", label: "+9%" }} footnote="83% to goal" />
          <MetricCard label="Revenue Today" value="$8,200" footnote="2 deals closed" />
          <MetricCard label="Calls Today" value="14" footnote="of 18 target" />
          <MetricCard label="Follow-Ups Due" value="6" footnote="2 overdue" />
          <MetricCard label="Open Opportunities" value="12" footnote="$214k pipeline" />
          <MetricCard label="Close Rate" value="34%" change={{ trend: "up", label: "+3%" }} footnote="last 30 days" />
          <MetricCard label="Show Rate" value="78%" change={{ trend: "down", label: "-1%" }} footnote="of booked demos" />
          <MetricCard label="Goal Progress" value="83%" footnote="$50k blood goal" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pace to Goal</CardTitle>
            <span className="text-sm text-muted-foreground">
              $62,400 of $50,000 blood goal
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ProgressBar value={83} indicatorClassName="bg-emerald-500" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                14 days left · $1,840 cash per call
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                On pace · stretch $75k
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Priority Queue</CardTitle>
              <Link
                href="/dashboard/hot-lists"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col">
              <ul className="flex flex-col divide-y divide-border/60">
                {queue.map((opp) => (
                  <li
                    key={opp.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <ScorePill score={opp.score} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {opp.name}
                          <span className="ml-1.5 font-normal text-muted-foreground">
                            {opp.company}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {opp.reason}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{opp.stage}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Follow-Ups Due</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <ul className="flex flex-col divide-y divide-border/60">
                {followUps.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-14 justify-center">
                        {item.type}
                      </Badge>
                      <span className="text-sm">{item.target}</span>
                    </div>
                    <span
                      className={cn(
                        "text-sm tabular-nums",
                        item.overdue
                          ? "font-medium text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
