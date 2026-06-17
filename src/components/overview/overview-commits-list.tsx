import Link from "next/link"

import { SectionHeading } from "@/components/section-heading"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GitHubCommitSummary } from "@/lib/pipedream/types"

function formatRelativeDate(iso: string) {
  const date = new Date(iso)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)))
    return `${diffMinutes}m ago`
  }

  if (diffHours < 48) {
    return `${diffHours}h ago`
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function OverviewCommitsList({
  activeRepo,
  commits,
}: {
  activeRepo: string
  commits: GitHubCommitSummary[]
}) {
  if (commits.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading
        title="Recent commits"
        description={`Live from ${activeRepo}`}
      />
      <Card className="overflow-hidden py-0 shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Commit</TableHead>
              <TableHead className="px-4">Author</TableHead>
              <TableHead className="px-4 text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commits.map((commit) => (
              <TableRow key={commit.sha}>
                <TableCell className="px-4 py-3">
                  {commit.htmlUrl ? (
                    <Link
                      href={commit.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:underline"
                    >
                      {commit.message}
                    </Link>
                  ) : (
                    <span className="font-medium">{commit.message}</span>
                  )}
                  <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                    {commit.sha}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {commit.author}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  {formatRelativeDate(commit.committedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
}
