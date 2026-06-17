import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/progress-bar"

const objectives = [
  {
    title: "Ship the enterprise readiness milestone",
    owner: "Founder",
    keyResults: [
      { label: "Ship SAML SSO + granular RBAC", progress: 64 },
      { label: "Audit log export GA", progress: 71 },
      { label: "SOC2 controls implemented", progress: 52 },
    ],
  },
  {
    title: "Reach elite delivery performance",
    owner: "Platform Lead",
    keyResults: [
      { label: "Lead time under 4h median", progress: 88 },
      { label: "Change failure rate below 5%", progress: 82 },
      { label: "Deploy frequency 10+/day", progress: 76 },
    ],
  },
  {
    title: "Raise fleet reliability to 8.5",
    owner: "Platform Lead",
    keyResults: [
      { label: "Calibrate all below-baseline agents", progress: 50 },
      { label: "Lift merge rate to 95%", progress: 83 },
      { label: "Quarantine and fix flaky tests", progress: 60 },
    ],
  },
]

function avg(values: number[]) {
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

export default function RoadmapPage() {
  return (
      <PageContainer>
        <PageHeader
          title="Roadmap"
          subtitle="Objectives and key results steering the factory this quarter."
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
  )
}
