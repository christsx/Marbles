import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/progress-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ForecastChart } from "@/components/charts/forecast-chart"

const repForecasts = [
  { name: "Sarah Chen", committed: "$48,000", forecast: "$62,000", attainment: 83 },
  { name: "Marcus Webb", committed: "$41,000", forecast: "$55,000", attainment: 78 },
  { name: "Diego Ramos", committed: "$33,000", forecast: "$48,000", attainment: 74 },
  { name: "Priya Nair", committed: "$30,000", forecast: "$42,000", attainment: 76 },
  { name: "Tyler Brooks", committed: "$14,000", forecast: "$24,000", attainment: 41 },
]

export default function ForecastingPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Executive" }, { label: "Forecasting" }]}>
      <PageContainer>
        <PageHeader
          title="Forecasting"
          subtitle="Projected revenue and attainment against goal."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Forecast (EOM)" value="$312,000" footnote="projected close" />
          <MetricCard label="Committed" value="$248,500" footnote="weighted pipeline" />
          <MetricCard
            label="Gap to Goal"
            value="$38,000"
            change={{ trend: "down", label: "closing" }}
            footnote="$350k team goal"
          />
          <MetricCard label="Confidence" value="High" footnote="based on close + show rate" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastChart />
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Forecast by Rep</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Rep</TableHead>
                  <TableHead className="px-4 text-right">Committed</TableHead>
                  <TableHead className="px-4 text-right">Forecast</TableHead>
                  <TableHead className="px-4">Attainment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repForecasts.map((rep) => (
                  <TableRow key={rep.name}>
                    <TableCell className="px-4 py-3 font-medium">{rep.name}</TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {rep.committed}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {rep.forecast}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProgressBar value={rep.attainment} className="max-w-32" />
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {rep.attainment}%
                        </span>
                        {rep.attainment < 50 && (
                          <Badge variant="destructive">Behind</Badge>
                        )}
                      </div>
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
