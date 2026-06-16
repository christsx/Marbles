import Link from "next/link"
import {
  ArrowUpRightIcon,
  FileTextIcon,
  MailIcon,
  MessageSquareIcon,
  PresentationIcon,
  ShieldCheckIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { assetCategories } from "@/lib/assets"

const icons: Record<string, LucideIcon> = {
  "follow-up-templates": MailIcon,
  "objection-library": ShieldCheckIcon,
  "sales-decks": PresentationIcon,
  "demo-recordings": VideoIcon,
  "call-scripts": MessageSquareIcon,
  "case-studies": FileTextIcon,
}

export default function AssetFactoryPage() {
  return (
    <DashboardShell
      breadcrumb={[{ label: "Marketing & Team" }, { label: "Asset Factory" }]}
    >
      <PageContainer>
        <PageHeader
          title="Asset Factory"
          subtitle="Centralized sales assets, templates, and enablement."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assetCategories.map((cat) => {
            const Icon = icons[cat.slug] ?? FileTextIcon
            return (
              <Link
                key={cat.slug}
                href={`/dashboard/asset-factory/${cat.slug}`}
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
