import {
  AlertTriangleIcon,
  GaugeIcon,
  GitPullRequestIcon,
  ShieldCheckIcon,
  TargetIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  {
    icon: GaugeIcon,
    label: "Shipped Yesterday",
    body: "142 work orders merged across 4 repos — 18% above the daily pace.",
  },
  {
    icon: AlertTriangleIcon,
    label: "At Risk",
    body: "WO-1835 blocked on a flaky test; WO-1828 waiting on blueprint approval; secrets-rotation blueprint still in draft.",
  },
  {
    icon: GitPullRequestIcon,
    label: "Awaiting Review",
    body: "5 PRs open for review, 2 high-priority (OAuth device-code, dark-mode tokens).",
  },
  {
    icon: TargetIcon,
    label: "Top Priorities",
    body: "Unblock the web-app test suite first, then ship the billing metering pipeline (WO-1839).",
  },
  {
    icon: ShieldCheckIcon,
    label: "Fleet & Quality",
    body: "Calibrate Echo and Sol (below baseline). Coverage holding at 87%, deploy success 98%.",
  },
]

const archive = [
  { date: "Jun 15, 2026", summary: "Throughput +12% WoW · 2 agents below baseline" },
  { date: "Jun 14, 2026", summary: "Billing Sev1 resolved in 72m · postmortem filed" },
  { date: "Jun 13, 2026", summary: "Coverage gate raised to 80% · 11 flaky tests quarantined" },
]

export default function BriefingsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Operate" }, { label: "Briefings" }]}>
      <PageContainer>
        <PageHeader
          title="Briefings"
          subtitle="Your AI-generated summary of what the factory needs today."
        />

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today · June 16, 2026</CardTitle>
            <Badge variant="secondary">Generated 8:00 AM</Badge>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y divide-border/60">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <li
                    key={section.label}
                    className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{section.label}</span>
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {section.body}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Past Briefings</h2>
          <div className="flex flex-col gap-3">
            {archive.map((item) => (
              <Card key={item.date}>
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.date}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.summary}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </PageContainer>
    </DashboardShell>
  )
}
