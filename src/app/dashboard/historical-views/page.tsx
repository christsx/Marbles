import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  HistoricalChart,
  type HistoricalPeriod,
} from "@/components/charts/historical-chart"
import { cn } from "@/lib/utils"

const periods: { id: HistoricalPeriod; label: string }[] = [
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "12m", label: "Last 12 months" },
]

const summary: Record<
  HistoricalPeriod,
  { revenue: string; deals: string; close: string; show: string }
> = {
  "30d": { revenue: "$245k", deals: "38", close: "31%", show: "73%" },
  "90d": { revenue: "$687k", deals: "112", close: "29%", show: "71%" },
  "12m": { revenue: "$2.38M", deals: "418", close: "27%", show: "69%" },
}

function resolvePeriod(raw: string | undefined): HistoricalPeriod {
  const match = periods.find((p) => p.id === raw)
  return match ? match.id : "12m"
}

export default async function HistoricalViewsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period: rawPeriod } = await searchParams
  const period = resolvePeriod(rawPeriod)
  const s = summary[period]

  return (
    <DashboardShell
      breadcrumb={[{ label: "Performance" }, { label: "Historical Views" }]}
    >
      <PageContainer>
        <PageHeader
          title="Historical Views"
          subtitle="Performance trends across time."
        />

        <div className="flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
          {periods.map((tab) => {
            const active = tab.id === period
            return (
              <Link
                key={tab.id}
                href={`/dashboard/historical-views?period=${tab.id}`}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Revenue" value={s.revenue} footnote="selected period" />
          <MetricCard label="Deals Closed" value={s.deals} footnote="won opportunities" />
          <MetricCard label="Close Rate" value={s.close} footnote="period average" />
          <MetricCard label="Show Rate" value={s.show} footnote="period average" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <HistoricalChart period={period} />
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
