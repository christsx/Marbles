import Link from "next/link"
import {
  ArrowUpRightIcon,
  BoxIcon,
  FileCodeIcon,
  FileTextIcon,
  GitPullRequestIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  type LucideIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { artifactCategories } from "@/lib/artifacts"

const icons: Record<string, LucideIcon> = {
  "pull-requests": GitPullRequestIcon,
  "generated-modules": BoxIcon,
  "api-schemas": FileCodeIcon,
  "test-suites": FlaskConicalIcon,
  migrations: DatabaseIcon,
  docs: FileTextIcon,
}

export default function ArtifactsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Build & Ship" }, { label: "Artifacts" }]}>
      <PageContainer>
        <PageHeader
          title="Artifacts"
          subtitle="Everything the agents produce — PRs, modules, schemas, tests, and docs."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artifactCategories.map((cat) => {
            const Icon = icons[cat.slug] ?? FileTextIcon
            return (
              <Link
                key={cat.slug}
                href={`/dashboard/artifacts/${cat.slug}`}
                className="group"
              >
                <Card className="h-full transition-colors group-hover:border-foreground/20 group-hover:bg-muted/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="size-5" />
                      </span>
                      <Badge variant="secondary" className="tabular-nums">
                        {cat.count}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 flex items-center justify-between text-base">
                      {cat.title}
                      <ArrowUpRightIcon className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                    <span className="text-xs text-muted-foreground/80">
                      {cat.items.length} recently updated
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
