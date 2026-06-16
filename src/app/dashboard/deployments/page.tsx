import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { SectionHeading } from "@/components/section-heading"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DeployStatus = "Success" | "Rolled back" | "Deploying"

type Deployment = {
  version: string
  service: string
  env: "prod" | "staging"
  status: DeployStatus
  agent: string
  time: string
}

const deployments: Deployment[] = [
  { version: "v2.41.0", service: "core-api", env: "prod", status: "Success", agent: "Orion", time: "12 min ago" },
  { version: "v1.88.2", service: "web-app", env: "prod", status: "Deploying", agent: "Nova", time: "just now" },
  { version: "v0.32.1", service: "billing-svc", env: "staging", status: "Success", agent: "Atlas", time: "40 min ago" },
  { version: "v2.40.3", service: "core-api", env: "prod", status: "Rolled back", agent: "Echo", time: "2 hours ago" },
  { version: "v1.88.1", service: "web-app", env: "prod", status: "Success", agent: "Nova", time: "3 hours ago" },
  { version: "v0.9.4", service: "infra", env: "prod", status: "Success", agent: "Echo", time: "Yesterday" },
]

const deployStatusTone: Record<DeployStatus, StatusTone> = {
  "Rolled back": "error",
  Deploying: "warning",
  Success: "success",
}

export default function DeploymentsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Build & Ship" }, { label: "Deployments" }]}>
      <PageContainer>
        <PageHeader
          title="Deployments"
          subtitle="Every release across services, with rollbacks and deploy health."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Deploys Today" value="11" change={{ trend: "up", label: "+3" }} footnote="across 4 services" />
          <MetricCard label="Success Rate" value="98%" change={{ trend: "up", label: "+2%" }} footnote="last 7 days" />
          <MetricCard label="Rollbacks" value="2" change={{ trend: "down", label: "-1" }} footnote="this week" />
          <MetricCard label="Avg Deploy Time" value="4m 06s" change={{ trend: "down", label: "-31s" }} footnote="commit → prod" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Release Train · v2.42</CardTitle>
            <span className="text-sm text-muted-foreground">9 of 12 work orders merged</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ProgressBar value={75} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cut planned for Friday</span>
              <StatusBadge tone="success">On track · 3 in review</StatusBadge>
            </div>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <SectionHeading title="Recent Deployments" />
          <Card className="py-0 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Version</TableHead>
                  <TableHead className="px-4">Service</TableHead>
                  <TableHead className="px-4">Env</TableHead>
                  <TableHead className="px-4">By</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4 text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-4 py-3 font-mono font-medium">
                      {d.version}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {d.service}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant={d.env === "prod" ? "secondary" : "outline"}>
                        {d.env}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {d.agent}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge tone={deployStatusTone[d.status]}>
                        {d.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {d.time}
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
