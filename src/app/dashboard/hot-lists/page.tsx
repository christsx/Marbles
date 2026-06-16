import Link from "next/link"
import { StarIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ScorePill } from "@/components/score-pill"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  OPPORTUNITY_VIEWS,
  opportunitiesByView,
  viewCounts,
  type OpportunityView,
} from "@/lib/opportunities"

function resolveView(raw: string | undefined): OpportunityView {
  const match = OPPORTUNITY_VIEWS.find((v) => v.id === raw)
  return match ? match.id : "today"
}

function parseValue(value: string): number {
  return Number(value.replace(/[^0-9.]/g, "")) || 0
}

export default async function HotListsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const { view: rawView } = await searchParams
  const view = resolveView(rawView)
  const counts = viewCounts()
  const opportunities = opportunitiesByView(view)
  const isOverdue = view === "overdue"

  const pipeline = opportunities.reduce((sum, o) => sum + parseValue(o.value), 0)
  const starred = opportunities.filter((o) => o.starred).length
  const scored = opportunities.filter((o) => o.score > 0)
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, o) => sum + o.score, 0) / scored.length)
    : 0

  return (
    <DashboardShell
      breadcrumb={[{ label: "Pipeline & Sales" }, { label: "Hot Lists" }]}
    >
      <PageContainer>
        <PageHeader
          title="Hot Lists"
          subtitle="Your prioritized execution queue — work the top of the list first."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Pipeline in View"
            value={`$${pipeline.toLocaleString()}`}
            footnote={`${opportunities.length} opportunities`}
          />
          <MetricCard
            label="Avg Priority"
            value={avgScore ? `${avgScore}` : "—"}
            footnote="0–100 score"
          />
          <MetricCard label="Starred" value={`${starred}`} footnote="flagged by you" />
          <MetricCard
            label="Overdue"
            value={`${counts.overdue}`}
            footnote="need follow-up"
          />
        </div>

        <div className="flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
          {OPPORTUNITY_VIEWS.map((tab) => {
            const active = tab.id === view
            return (
              <Link
                key={tab.id}
                href={`/dashboard/hot-lists?view=${tab.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "tabular-nums",
                    active ? "text-muted-foreground" : "text-muted-foreground/70"
                  )}
                >
                  {counts[tab.id]}
                </span>
              </Link>
            )
          })}
        </div>

        <Card className="overflow-hidden py-0">
          {opportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium">Nothing here</p>
              <p className="text-sm text-muted-foreground">
                No opportunities in this view.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10 pl-4" />
                  <TableHead className="w-20 px-4">Priority</TableHead>
                  <TableHead className="px-4">Opportunity</TableHead>
                  <TableHead className="px-4 text-right">Value</TableHead>
                  <TableHead className="px-4">Owner</TableHead>
                  <TableHead className="px-4">Stage</TableHead>
                  <TableHead className="px-4 text-right">Next Follow-Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opp) => (
                  <TableRow
                    key={opp.id}
                    className={cn(
                      "transition-colors",
                      isOverdue && "bg-rose-500/[0.03]"
                    )}
                  >
                    <TableCell className="pl-4">
                      <StarIcon
                        className={cn(
                          "size-4",
                          opp.starred
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <ScorePill score={opp.score} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="leading-tight">
                          <span className="font-medium">{opp.name}</span>
                          <span className="ml-1.5 text-muted-foreground">
                            {opp.company}
                          </span>
                        </span>
                        <span className="text-xs leading-tight text-muted-foreground">
                          {opp.reason}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {opp.value}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {opp.owner}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="secondary">{opp.stage}</Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "px-4 py-3 text-right tabular-nums",
                        isOverdue
                          ? "font-medium text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {opp.nextFollowUp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
