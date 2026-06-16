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

type Severity = "high" | "medium" | "low"

type Alert = {
  severity: Severity
  issue: string
  owner: string
  status: string
}

const alerts: Alert[] = [
  { severity: "high", issue: "SLA breach — lead uncontacted 22m", owner: "Tyler Brooks", status: "Open" },
  { severity: "high", issue: "Missing demo outcome (3 deals)", owner: "Diego Ramos", status: "Open" },
  { severity: "medium", issue: "Coaching overdue — 6 days", owner: "Jordan Lee", status: "In progress" },
  { severity: "medium", issue: "Missing notes on closed-won", owner: "Marcus Webb", status: "Open" },
  { severity: "low", issue: "Next step not set", owner: "Priya Nair", status: "In progress" },
]

const severityMeta: Record<
  Severity,
  { label: string; bar: string; text: string }
> = {
  high: {
    label: "High",
    bar: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
  },
  medium: {
    label: "Medium",
    bar: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  low: {
    label: "Low",
    bar: "bg-muted-foreground/40",
    text: "text-muted-foreground",
  },
}

function SeverityCell({ severity }: { severity: Severity }) {
  const meta = severityMeta[severity]
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-3.5 w-1 rounded-full", meta.bar)} />
      <span className={cn("text-xs font-medium", meta.text)}>{meta.label}</span>
    </span>
  )
}

export function CriticalAlerts() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-medium">Critical Alerts</h2>
        <span className="text-sm text-muted-foreground">
          {alerts.filter((a) => a.severity === "high").length} high priority
        </span>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28 px-4">Severity</TableHead>
              <TableHead className="px-4">Issue</TableHead>
              <TableHead className="px-4">Owner</TableHead>
              <TableHead className="px-4 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert, i) => (
              <TableRow
                key={i}
                className={cn(
                  alert.severity === "high" && "bg-rose-500/[0.04]"
                )}
              >
                <TableCell className="px-4 py-3">
                  <SeverityCell severity={alert.severity} />
                </TableCell>
                <TableCell className="px-4 py-3 font-medium">
                  {alert.issue}
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {alert.owner}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-muted-foreground">
                  {alert.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
}
