"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { ChevronDownIcon, ExternalLinkIcon } from "lucide-react"

import { setActiveRepoAction } from "@/app/dashboard/integrations/actions"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { GitHubRepoDetails } from "@/lib/pipedream/types"
import { cn } from "@/lib/utils"

type GitHubRepoCardProps = {
  trackedRepos: string[]
  activeRepo: string | null
  repoDetails: GitHubRepoDetails | null
  connected: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatFileCount(count: number | null) {
  if (count === null) {
    return "—"
  }

  if (count >= 100_000) {
    return `${count.toLocaleString()}+`
  }

  return count.toLocaleString()
}

export function GitHubRepoCard({
  trackedRepos,
  activeRepo,
  repoDetails,
  connected,
}: GitHubRepoCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const hasTracked = trackedRepos.length > 0
  const repoName = activeRepo ?? "No repository selected"
  const canSwap = trackedRepos.length > 1

  const swapRepo = (fullName: string) => {
    if (fullName === activeRepo) {
      return
    }

    startTransition(async () => {
      const result = await setActiveRepoAction(fullName)

      if (result.ok) {
        router.refresh()
      }
    })
  }

  const githubLink = repoDetails?.htmlUrl ? (
    <Link
      href={repoDetails.htmlUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex shrink-0 items-center text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Open ${repoName} on GitHub`}
    >
      <ExternalLinkIcon className="size-3.5" />
    </Link>
  ) : null

  const repoHeading = canSwap ? (
    <div className="flex min-w-0 items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Switch repository"
            className={cn(
              "inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-md px-1 py-0.5",
              "font-mono text-base font-medium outline-none",
              "transition-colors hover:bg-muted/60",
              "data-[state=open]:bg-muted/60"
            )}
          >
            <span className="truncate">{repoName}</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto max-w-md">
          {trackedRepos.map((repo) => (
            <DropdownMenuItem
              key={repo}
              onClick={() => swapRepo(repo)}
              className="font-mono text-sm"
              title={repo}
            >
              <span className="truncate">{repo}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {githubLink}
    </div>
  ) : repoDetails?.htmlUrl ? (
    <Link
      href={repoDetails.htmlUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center gap-1.5 truncate font-mono text-base font-medium hover:underline"
    >
      <span className="truncate">{repoName}</span>
      <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
    </Link>
  ) : (
    <CardTitle className="truncate font-mono text-base font-medium">
      {hasTracked ? repoName : "Connect a repository"}
    </CardTitle>
  )

  return (
    <Card className={cn(isPending && "opacity-70")}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="min-w-0 flex-1">{repoHeading}</div>
        <StatusBadge
          tone={
            hasTracked && repoDetails ? "success" : hasTracked ? "warning" : "neutral"
          }
        >
          {!connected
            ? "Not connected"
            : !hasTracked
              ? "No repos tracked"
              : repoDetails
                ? "Live"
                : "Loading…"}
        </StatusBadge>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-x-12 gap-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Files</p>
          <p className="font-semibold tabular-nums">
            {repoDetails ? formatFileCount(repoDetails.fileCount) : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Last push</p>
          <p className="font-semibold tabular-nums">
            {repoDetails ? formatDate(repoDetails.pushedAt) : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Open issues</p>
          <p className="font-semibold tabular-nums">
            {repoDetails ? repoDetails.openIssues.toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Default branch</p>
          <p className="font-semibold font-mono">
            {repoDetails?.defaultBranch ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Language</p>
          <p className="font-semibold">
            {repoDetails?.language ?? "—"}
          </p>
        </div>
      </CardContent>
      {!connected || !hasTracked ? (
        <CardContent className="pt-0">
          <Link
            href="/dashboard/integrations"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Connect on Integrations →
          </Link>
        </CardContent>
      ) : null}
    </Card>
  )
}
