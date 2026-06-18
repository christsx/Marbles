"use client"

import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type GitHubProjectPickerProps = {
  repos: string[]
  loading?: boolean
  connected: boolean
  selectedRepo: string | null
  onSelect: (fullName: string) => void
}

export function GitHubProjectPicker({
  repos,
  loading = false,
  connected,
  selectedRepo,
  onSelect,
}: GitHubProjectPickerProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!connected) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Connect GitHub in{" "}
        <Link href="/dashboard/integrations" prefetch className="underline underline-offset-2">
          Integrations
        </Link>{" "}
        to attach a repo.
      </p>
    )
  }

  if (repos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No tracked repos yet. Add one in{" "}
        <Link href="/dashboard/integrations" prefetch className="underline underline-offset-2">
          Integrations
        </Link>
        .
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {repos.map((repo) => {
        const selected = repo === selectedRepo
        return (
          <button
            key={repo}
            type="button"
            onClick={() => onSelect(repo)}
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              selected
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border hover:bg-muted/40"
            )}
          >
            <span className="font-medium">{repo}</span>
          </button>
        )
      })}
    </div>
  )
}
