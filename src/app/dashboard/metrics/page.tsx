import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Repo = {
  name: string
  shipped: number
  mergeRate: number
  coverage: number
  deploys: number
  color: string
}

const repos: Repo[] = [
  { name: "core-api", shipped: 52, mergeRate: 93, coverage: 89, deploys: 18, color: "var(--chart-1)" },
  { name: "web-app", shipped: 41, mergeRate: 90, coverage: 84, deploys: 22, color: "var(--chart-2)" },
  { name: "billing-svc", shipped: 24, mergeRate: 88, coverage: 86, deploys: 9, color: "var(--chart-3)" },
  { name: "infra", shipped: 16, mergeRate: 79, coverage: 71, deploys: 14, color: "var(--chart-4)" },
  { name: "docs-site", shipped: 9, mergeRate: 84, coverage: 62, deploys: 7, color: "var(--chart-5)" },
]

const totalShipped = repos.reduce((sum, r) => sum + r.shipped, 0)

export default function MetricsPage() {
  return (
      <PageContainer>
        <PageHeader
          title="Metrics"
          subtitle="Delivery performance across the factory — DORA and throughput."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Deploy Frequency" value="9.7/day" change={{ trend: "up", label: "+1.2" }} footnote="Elite" />
          <MetricCard label="Lead Time" value="3.4h" change={{ trend: "down", label: "-22m" }} footnote="spec → prod median" />
          <MetricCard label="Change Failure" value="4.1%" change={{ trend: "down", label: "-0.8%" }} footnote="rollbacks ÷ deploys" />
          <MetricCard label="MTTR" value="34m" change={{ trend: "down", label: "-9m" }} footnote="mean time to restore" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Throughput by Repo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {repos.map((repo) => (
                <div
                  key={repo.name}
                  style={{
                    width: `${(repo.shipped / totalShipped) * 100}%`,
                    backgroundColor: repo.color,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {repos.map((repo) => (
                <div key={repo.name} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: repo.color }}
                  />
                  <span className="text-sm text-muted-foreground">{repo.name}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {Math.round((repo.shipped / totalShipped) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Repo Breakdown</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Repo</TableHead>
                  <TableHead className="px-4 text-right">Shipped</TableHead>
                  <TableHead className="px-4 text-right">Merge Rate</TableHead>
                  <TableHead className="w-40 px-4">Coverage</TableHead>
                  <TableHead className="px-4 text-right">Deploys</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repos.map((repo) => (
                  <TableRow key={repo.name}>
                    <TableCell className="px-4 py-3 font-mono font-medium">
                      {repo.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {repo.shipped}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {repo.mergeRate}%
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <ProgressBar value={repo.coverage} className="flex-1" />
                        <span className="w-9 text-right text-sm tabular-nums text-muted-foreground">
                          {repo.coverage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {repo.deploys}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </PageContainer>
  )
}
