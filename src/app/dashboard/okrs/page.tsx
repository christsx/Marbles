import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/progress-bar"

const objectives = [
  {
    title: "Hit $350k monthly revenue",
    owner: "Founder",
    keyResults: [
      { label: "Close $350k in new revenue", progress: 71 },
      { label: "Maintain 80%+ collection rate", progress: 82 },
      { label: "Grow Done-For-You offer to $150k", progress: 88 },
    ],
  },
  {
    title: "Improve team execution",
    owner: "Sales Manager",
    keyResults: [
      { label: "95% follow-up completion", progress: 86 },
      { label: "Sub-10min speed-to-lead", progress: 94 },
      { label: "90% CRM compliance", progress: 88 },
    ],
  },
  {
    title: "Raise close rate to 35%",
    owner: "Sales Manager",
    keyResults: [
      { label: "Complete 12 coaching reviews", progress: 58 },
      { label: "Lift team close rate to 35%", progress: 83 },
      { label: "Reduce reps below baseline to 0", progress: 60 },
    ],
  },
]

function avg(values: number[]) {
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

export default function OkrsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Marketing & Team" }, { label: "OKRs" }]}>
      <PageContainer>
        <PageHeader
          title="OKRs"
          subtitle="Objectives and key results for this quarter."
        />

        <div className="flex flex-col gap-4">
          {objectives.map((obj) => {
            const overall = avg(obj.keyResults.map((kr) => kr.progress))
            return (
              <Card key={obj.title}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base">{obj.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">{obj.owner}</span>
                  </div>
                  <Badge variant="secondary" className="tabular-nums">
                    {overall}%
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {obj.keyResults.map((kr) => (
                    <div key={kr.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span>{kr.label}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {kr.progress}%
                        </span>
                      </div>
                      <ProgressBar value={kr.progress} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
