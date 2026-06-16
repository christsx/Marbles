import {
  AlertTriangleIcon,
  CalendarClockIcon,
  DollarSignIcon,
  GraduationCapIcon,
  TargetIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  {
    icon: DollarSignIcon,
    label: "Revenue Yesterday",
    body: "$32,400 collected across 4 closed deals — 18% above daily pace.",
  },
  {
    icon: AlertTriangleIcon,
    label: "Deals at Risk",
    body: "3 deals stalled: Globex (ghosting 6d), Initech (renewal in 9d), Umbrella (pricing).",
  },
  {
    icon: CalendarClockIcon,
    label: "Follow-Ups Due",
    body: "14 follow-ups due today, 6 overdue. Concentrated in Sarah and Diego's queues.",
  },
  {
    icon: TargetIcon,
    label: "Top Priorities",
    body: "Work the Hot List top 3 first — $214k of combined pipeline awaiting next action.",
  },
  {
    icon: GraduationCapIcon,
    label: "Coaching Recommendations",
    body: "Review Tyler's objection handling (49) and Jordan's discovery (52) this week.",
  },
]

const archive = [
  { date: "Jun 15, 2026", summary: "Revenue +12% WoW · 2 reps below baseline" },
  { date: "Jun 14, 2026", summary: "Strong show rate · 11 follow-ups cleared" },
  { date: "Jun 13, 2026", summary: "SLA breach flagged · coaching assigned" },
]

export default function DailyBriefingsPage() {
  return (
    <DashboardShell
      breadcrumb={[{ label: "Executive" }, { label: "Daily Briefings" }]}
    >
      <PageContainer>
        <PageHeader
          title="Daily Briefings"
          subtitle="Your AI-generated summary of what needs attention today."
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
