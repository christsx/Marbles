import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
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

type Severity = "Sev1" | "Sev2" | "Sev3"
type IncidentStatus = "Investigating" | "Mitigated" | "Resolved"

type Incident = {
  id: string
  title: string
  severity: Severity
  service: string
  status: IncidentStatus
  duration: string
  started: string
}

const incidents: Incident[] = [
  { id: "INC-204", title: "Elevated 5xx on export endpoint", severity: "Sev2", service: "core-api", status: "Mitigated", duration: "28m", started: "Today 09:12" },
  { id: "INC-203", title: "Dashboard feed websocket flapping", severity: "Sev3", service: "web-app", status: "Investigating", duration: "ongoing", started: "Today 11:40" },
  { id: "INC-201", title: "Billing meter double-counting usage", severity: "Sev1", service: "billing-svc", status: "Resolved", duration: "1h 12m", started: "Jun 14 22:03" },
  { id: "INC-198", title: "Deploy rollback on infra module", severity: "Sev2", service: "infra", status: "Resolved", duration: "41m", started: "Jun 13 16:20" },
  { id: "INC-195", title: "Auth latency spike after release", severity: "Sev3", service: "core-api", status: "Resolved", duration: "22m", started: "Jun 11 08:55" },
]

function SeverityBadge({ severity }: { severity: Severity }) {
  if (severity === "Sev1") return <Badge variant="destructive">Sev1</Badge>
  if (severity === "Sev2")
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        Sev2
      </Badge>
    )
  return <Badge variant="secondary">Sev3</Badge>
}

function StatusLabel({ status }: { status: IncidentStatus }) {
  return (
    <span
      className={cn(
        "text-sm",
        status === "Resolved"
          ? "text-muted-foreground"
          : status === "Investigating"
            ? "font-medium text-rose-600 dark:text-rose-400"
            : "text-foreground"
      )}
    >
      {status}
    </span>
  )
}

export default function IncidentsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Quality" }, { label: "Incidents" }]}>
      <PageContainer>
        <PageHeader
          title="Incidents"
          subtitle="Production incidents, response, and postmortems across services."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Open Incidents" value="2" footnote="1 investigating" />
          <MetricCard label="MTTR" value="34m" change={{ trend: "down", label: "-9m" }} footnote="mean time to restore" />
          <MetricCard label="Sev1 (30d)" value="1" change={{ trend: "down", label: "-2" }} footnote="resolved" />
          <MetricCard label="Uptime (30d)" value="99.96%" footnote="across all services" />
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Recent Incidents</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 px-4">Severity</TableHead>
                  <TableHead className="px-4">Incident</TableHead>
                  <TableHead className="px-4">Service</TableHead>
                  <TableHead className="px-4 text-right">Duration</TableHead>
                  <TableHead className="px-4">Started</TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow
                    key={inc.id}
                    className={cn(inc.status === "Investigating" && "bg-rose-500/[0.04]")}
                  >
                    <TableCell className="px-4 py-3">
                      <SeverityBadge severity={inc.severity} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="font-medium">{inc.title}</span>
                      <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                        {inc.id}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline">{inc.service}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {inc.duration}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground tabular-nums">
                      {inc.started}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <StatusLabel status={inc.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </PageContainer>
    </DashboardShell>
  )
}
