"use client"

import { StarIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GitHubRepoTrackerListProps = {
  trackedRepos: string[]
  activeRepo: string | null
  saving: boolean
  onMakeActive: (repo: string) => void
  onRemove: (repo: string) => void
}

export function GitHubRepoTrackerList({
  trackedRepos,
  activeRepo,
  saving,
  onMakeActive,
  onRemove,
}: GitHubRepoTrackerListProps) {
  if (trackedRepos.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        No repositories tracked yet.
      </div>
    )
  }

  return (
    <ul className="divide-y">
      {trackedRepos.map((repo) => {
        const isActive = activeRepo === repo
        return (
          <li key={repo} className="flex items-center gap-2 px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn("text-muted-foreground", isActive && "text-foreground")}
              aria-label={`Show ${repo} on overview`}
              onClick={() => onMakeActive(repo)}
            >
              <StarIcon className={cn("size-4", isActive && "fill-current")} />
            </Button>
            <span className="min-w-0 flex-1 truncate font-medium">{repo}</span>
            {isActive ? (
              <span className="text-xs text-muted-foreground">overview</span>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${repo}`}
              onClick={() => onRemove(repo)}
              disabled={saving}
            >
              <XIcon className="size-4" />
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
