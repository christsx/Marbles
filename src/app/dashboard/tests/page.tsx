import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const failingSuites = [
  { suite: "websocket-reconnect.spec", repo: "web-app", reason: "Timeout after 5s", owner: "Nova" },
  { suite: "billing-metering.int", repo: "billing-svc", reason: "Assertion: usage drift", owner: "Atlas" },
  { suite: "session-migrate.int", repo: "core-api", reason: "Migration not applied", owner: "Echo" },
]

const flakyTests = [
  { test: "reconnects after network drop", rate: "12% fail", repo: "web-app" },
  { test: "dedupes concurrent events", rate: "8% fail", repo: "billing-svc" },
  { test: "rotates refresh token", rate: "6% fail", repo: "core-api" },
  { test: "renders empty dashboard state", rate: "4% fail", repo: "web-app" },
]

export default function TestsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Build & Ship" }, { label: "Tests" }]}>
      <PageContainer>
        <PageHeader
          title="Tests"
          subtitle="Suite health, coverage, and what's failing right now."
          action={
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Last run 4 min ago · on every push
            </span>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Pass Rate" value="96%" change={{ trend: "up", label: "+1%" }} footnote="last 24h" />
          <MetricCard label="Coverage" value="87%" change={{ trend: "up", label: "+2%" }} footnote="80% gate" />
          <MetricCard label="Total Tests" value="4,182" footnote="across 73 suites" />
          <MetricCard label="Avg Duration" value="2m 14s" change={{ trend: "down", label: "-18s" }} footnote="per suite" />
          <MetricCard label="Failing Now" value="3" footnote="suites red" />
          <MetricCard label="Flaky Tests" value="11" footnote="quarantine candidates" />
          <MetricCard label="Quarantined" value="4" footnote="excluded from gate" />
          <MetricCard label="Suites" value="73" footnote="unit · int · e2e" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Coverage to Gate</CardTitle>
            <span className="text-sm text-muted-foreground">87% of 80% gate</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ProgressBar value={87} indicatorClassName="bg-emerald-500" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Changed-lines coverage enforced on every PR
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Above gate · +7%
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Failing Suites</CardTitle>
              <Link
                href="/dashboard/work-orders?view=blocked"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View blocked
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col">
              <ul className="flex flex-col divide-y divide-border/60">
                {failingSuites.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-medium">
                        {s.suite}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {s.repo} · {s.reason}
                      </span>
                    </div>
                    <Badge variant="destructive">{s.owner}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Flaky Tests</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <ul className="flex flex-col divide-y divide-border/60">
                {flakyTests.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">{t.test}</span>
                      <span className="text-xs text-muted-foreground">{t.repo}</span>
                    </div>
                    <span
                      className={cn(
                        "text-sm tabular-nums font-medium text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {t.rate}
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
