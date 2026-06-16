import Link from "next/link"

import { SectionHeading } from "@/components/section-heading"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type WorkOrderStatus = "In review" | "Open" | "In progress"

type PendingWorkOrder = {
  id: string
  title: string
  assignee: string
  phase: string
  status: WorkOrderStatus
}

const items: PendingWorkOrder[] = [
  {
    id: "WO-2004",
    title: "Add indexes to codebase indexing",
    assignee: "Atlas",
    phase: "Phase 22",
    status: "In review",
  },
  {
    id: "WO-2001",
    title: "Blueprint approval gate for billing-svc",
    assignee: "Echo",
    phase: "Phase 21",
    status: "In review",
  },
  {
    id: "WO-1998",
    title: "Flaky websocket reconnect test suite",
    assignee: "Nova",
    phase: "Phase 21",
    status: "Open",
  },
  {
    id: "WO-1992",
    title: "Agent calibration for Echo and Sol",
    assignee: "Orion",
    phase: "Phase 20",
    status: "In progress",
  },
]

const statusTone: Record<WorkOrderStatus, StatusTone> = {
  "In review": "info",
  Open: "error",
  "In progress": "warning",
}

export function PendingWorkOrders() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading
        title="Pending work orders"
        description="4 active across factory phases"
        action={
          <Link
            href="/dashboard/work-orders"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        }
      />
      <Card className="overflow-hidden py-0 shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Work order</TableHead>
              <TableHead className="px-4">Assignee</TableHead>
              <TableHead className="px-4">Phase</TableHead>
              <TableHead className="px-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-3">
                  <span className="font-medium">{item.title}</span>
                  <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                    {item.id}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {item.assignee}
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {item.phase}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusBadge tone={statusTone[item.status]}>
                    {item.status}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
}
