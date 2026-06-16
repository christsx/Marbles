import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScorePill } from "@/components/score-pill"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { workOrders, type WorkOrderStatus } from "@/lib/work-orders"

export function WorkOrderStatusBadge({ status }: { status: WorkOrderStatus }) {
  if (status === "Blocked" || status === "Failing") {
    return <Badge variant="destructive">{status}</Badge>
  }
  if (status === "In review") {
    return (
      <Badge className="bg-violet-500/15 text-violet-700 dark:text-violet-400">
        {status}
      </Badge>
    )
  }
  if (status === "In progress") {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        {status}
      </Badge>
    )
  }
  return <Badge variant="secondary">{status}</Badge>
}

export function WorkOrderHealth() {
  const top = workOrders.slice(0, 5)
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-medium">Work Order Health</h2>
        <span className="text-sm text-muted-foreground">Top priority work</span>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 px-4">Priority</TableHead>
              <TableHead className="px-4">Work Order</TableHead>
              <TableHead className="px-4">Agent</TableHead>
              <TableHead className="px-4">Stage</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4">Next Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top.map((wo) => (
              <TableRow key={wo.id}>
                <TableCell className="px-4 py-3">
                  <ScorePill score={wo.priority} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span className="font-medium">{wo.title}</span>
                  <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                    {wo.id} · {wo.repo}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {wo.agent}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge variant="outline">{wo.stage}</Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <WorkOrderStatusBadge status={wo.status} />
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {wo.nextAction}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
}
