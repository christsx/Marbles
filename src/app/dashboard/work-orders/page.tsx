import Link from "next/link"
import { StarIcon } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ScorePill } from "@/components/score-pill"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
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
  WORK_ORDER_VIEWS,
  workOrdersByView,
  viewCounts,
  type WorkOrderStatus,
  type WorkOrderView,
} from "@/lib/work-orders"

const workOrderStatusTone: Record<WorkOrderStatus, StatusTone> = {
  Blocked: "error",
  Failing: "error",
  "In review": "info",
  "In progress": "warning",
  Queued: "neutral",
  Shipped: "success",
}

function resolveView(raw: string | undefined): WorkOrderView {
  const match = WORK_ORDER_VIEWS.find((v) => v.id === raw)
  return match ? match.id : "now"
}

export default async function WorkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const { view: rawView } = await searchParams
  const view = resolveView(rawView)
  const counts = viewCounts()
  const orders = workOrdersByView(view)

  const scored = orders.filter((o) => o.priority > 0)
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, o) => sum + o.priority, 0) / scored.length)
    : 0
  const starred = orders.filter((o) => o.starred).length

  return (
      <PageContainer>
        <PageHeader
          title="Work Orders"
          subtitle="The agent execution queue — highest-priority unblocked work first."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="In View"
            value={`${orders.length}`}
            footnote="work orders"
          />
          <MetricCard
            label="Avg Priority"
            value={avgScore ? `${avgScore}` : "—"}
            footnote="0–100 score"
          />
          <MetricCard label="Starred" value={`${starred}`} footnote="pinned by you" />
          <MetricCard
            label="Blocked"
            value={`${counts.blocked}`}
            footnote="need attention"
          />
        </div>

        <div className="flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
          {WORK_ORDER_VIEWS.map((tab) => {
            const active = tab.id === view
            return (
              <Link
                key={tab.id}
                href={`/dashboard/work-orders?view=${tab.id}`}
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

        <Card className="overflow-hidden py-0 shadow-xs">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium">Nothing here</p>
              <p className="text-sm text-muted-foreground">
                No work orders in this view.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10 pl-4" />
                  <TableHead className="w-20 px-4">Priority</TableHead>
                  <TableHead className="px-4">Work Order</TableHead>
                  <TableHead className="px-4">Agent</TableHead>
                  <TableHead className="px-4">Stage</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4 text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((wo) => (
                  <TableRow key={wo.id}>
                    <TableCell className="pl-4">
                      <StarIcon
                        className={cn(
                          "size-4",
                          wo.starred
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <ScorePill score={wo.priority} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="leading-tight">
                          <span className="font-medium">{wo.title}</span>
                          <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                            {wo.id} · {wo.repo}
                          </span>
                        </span>
                        <span className="text-xs leading-tight text-muted-foreground">
                          {wo.reason}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {wo.agent}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline">{wo.stage}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge tone={workOrderStatusTone[wo.status]}>
                        {wo.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {wo.updated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </PageContainer>
  )
}
