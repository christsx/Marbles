import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { assetCategories, getAssetCategory } from "@/lib/assets"

export function generateStaticParams() {
  return assetCategories.map((category) => ({ slug: category.slug }))
}

export default async function AssetCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getAssetCategory(slug)

  if (!category) {
    notFound()
  }

  return (
    <DashboardShell
      breadcrumb={[
        { label: "Marketing & Team" },
        { label: "Asset Factory", href: "/dashboard/asset-factory" },
        { label: category.title },
      ]}
    >
      <PageContainer>
        <Link
          href="/dashboard/asset-factory"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Asset Factory
        </Link>

        <PageHeader
          title={category.title}
          subtitle={`${category.count} assets · ${category.description}`}
        />

        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4">Asset</TableHead>
                <TableHead className="px-4">Type</TableHead>
                <TableHead className="px-4 text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.items.map((item) => (
                <TableRow key={item.title}>
                  <TableCell className="px-4 py-3 font-medium">
                    {item.title}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant="secondary">{item.kind}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right text-muted-foreground">
                    {item.updated}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
