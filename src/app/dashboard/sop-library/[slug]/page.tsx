import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getSop, sops } from "@/lib/sops"

export function generateStaticParams() {
  return sops.map((sop) => ({ slug: sop.slug }))
}

export default async function SopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const sop = getSop(slug)

  if (!sop) {
    notFound()
  }

  return (
    <DashboardShell
      breadcrumb={[
        { label: "Marketing & Team" },
        { label: "SOP Library", href: "/dashboard/sop-library" },
        { label: sop.title },
      ]}
    >
      <PageContainer>
        <Link
          href="/dashboard/sop-library"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to SOP Library
        </Link>

        <PageHeader title={sop.title} subtitle={sop.summary} />

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{sop.category}</Badge>
          <span className="text-sm text-muted-foreground">
            Owned by {sop.owner} · Updated {sop.updated}
          </span>
        </div>

        <Card>
          <CardContent className="flex flex-col divide-y divide-border/60">
            {sop.sections.map((section) => (
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
    </DashboardShell>
  )
}
