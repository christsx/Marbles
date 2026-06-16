import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueByOfferChart } from "@/components/charts/revenue-by-offer-chart"

export default function RevenueIntelligencePage() {
  return (
    <DashboardShell
      breadcrumb={[{ label: "Executive" }, { label: "Revenue Intelligence" }]}
    >
      <PageContainer>
        <PageHeader
          title="Revenue Intelligence"
          subtitle="Real-time visibility into revenue, pipeline, and conversion."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <MetricCard
            label="Revenue (MTD)"
            value="$248,500"
            change={{ trend: "up", label: "+12%" }}
            footnote="vs $221,800 last month"
          />
          <MetricCard
            label="Cash Collected"
            value="$203,900"
            change={{ trend: "up", label: "+8%" }}
            footnote="82% of booked revenue"
          />
          <MetricCard
            label="Pipeline Value"
            value="$1.42M"
            footnote="86 active opportunities"
          />
          <MetricCard
            label="Cash per Call"
            value="$1,840"
            change={{ trend: "up", label: "+5%" }}
            footnote="across 142 calls"
          />
          <MetricCard
            label="Close Rate"
            value="29%"
            change={{ trend: "up", label: "+3%" }}
            footnote="team average"
          />
          <MetricCard
            label="Show Rate"
            value="71%"
            change={{ trend: "down", label: "-2%" }}
            footnote="of booked demos"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueByOfferChart />
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
