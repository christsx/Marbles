"use client"

import { CheckIcon, GitBranchIcon } from "lucide-react"

import { setActiveRepoAction } from "@/app/dashboard/integrations/actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

type BlueprintProjectsRepoListProps = {
  disabled?: boolean
  attachedRepo: string | null
  workspaceDefaultRepo: string | null
  repos: string[]
  onSelect: (fullName: string) => void
  onClose: () => void
}

function sortRepos(repos: string[], workspaceDefaultRepo: string | null) {
  if (!workspaceDefaultRepo) return repos

  return [...repos].sort((left, right) => {
    if (left === workspaceDefaultRepo) return -1
    if (right === workspaceDefaultRepo) return 1
    return left.localeCompare(right)
  })
}

export function BlueprintProjectsRepoList({
  disabled = false,
  attachedRepo,
  workspaceDefaultRepo,
  repos,
  onSelect,
  onClose,
}: BlueprintProjectsRepoListProps) {
  const sortedRepos = sortRepos(repos, workspaceDefaultRepo)

  return sortedRepos.map((repo) => {
    const selected = repo === attachedRepo
    const isDefault = repo === workspaceDefaultRepo

    return (
      <DropdownMenuItem
        key={repo}
        disabled={disabled}
        className="blueprint-add-doc-menu-item"
        title={repo}
        onSelect={() => {
          void (async () => {
            const result = await setActiveRepoAction(repo)
            if (result.ok) onSelect(repo)
            onClose()
          })()
        }}
      >
        {selected ? (
          <CheckIcon className="mr-2 size-4 shrink-0 text-foreground" />
        ) : (
          <GitBranchIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">
          {repo.split("/")[1] ?? repo}
          {isDefault ? " · default" : ""}
        </span>
      </DropdownMenuItem>
    )
  })
}
