import Link from "next/link"

import { SetDashboardBreadcrumb } from "@/components/set-dashboard-breadcrumb"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getPlaybook, playbooks } from "@/lib/playbooks"

export function generateStaticParams() {
  return playbooks.map((playbook) => ({ slug: playbook.slug }))
}

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const playbook = getPlaybook(slug)

  if (!playbook) {
    notFound()
  }

  return (
    <>
      <SetDashboardBreadcrumb
        breadcrumb={[
          { label: "Operate" },
          { label: "Playbooks", href: "/dashboard/playbooks" },
          { label: playbook.title },
        ]}
      />
      <PageContainer>
        <Link
          href="/dashboard/playbooks"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Playbooks
        </Link>

        <PageHeader title={playbook.title} subtitle={playbook.summary} />

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{playbook.category}</Badge>
          <span className="text-sm text-muted-foreground">
            Owned by {playbook.owner} · Updated {playbook.updated}
          </span>
        </div>

        <Card>
          <CardContent className="flex flex-col divide-y divide-border/60">
            {playbook.sections.map((section) => (
              <div
                key={section.heading}
                className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0"
              >
                <h2 className="font-heading text-sm font-medium">
                  {section.heading}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  )
}
