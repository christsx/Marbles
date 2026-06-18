"use client"

import * as React from "react"
import { CheckIcon, FolderOpenIcon } from "lucide-react"

import { BlueprintProjectsMenu } from "@/components/blueprints/blueprint-projects-menu"
import { useGitHubProjects } from "@/components/blueprints/shared/use-github-projects"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type BlueprintProjectsButtonProps = {
  disabled?: boolean
  hideLabel?: boolean
  repoEnabled: boolean
  activeRepo: string | null
  workspaceDefaultRepo: string | null
  onSelect: (fullName: string) => void
}

export function BlueprintProjectsButton({
  disabled = false,
  hideLabel = false,
  repoEnabled,
  activeRepo,
  workspaceDefaultRepo,
  onSelect,
}: BlueprintProjectsButtonProps) {
  const [open, setOpen] = React.useState(false)
  const { loading, connected, repos } = useGitHubProjects(open)
  const attachedRepo = repoEnabled ? activeRepo : null
  const defaultLabel = workspaceDefaultRepo?.split("/")[1] ?? workspaceDefaultRepo

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          title={
            attachedRepo ??
            (defaultLabel
              ? `Attach project (defaults to ${defaultLabel})`
              : "Attach GitHub project")
          }
          aria-label="Attach GitHub project"
          className={cn(
            "blueprint-add-doc-button",
            repoEnabled && "has-selection",
            open && "is-open"
          )}
        >
          {repoEnabled ? (
            <CheckIcon className="size-4 shrink-0" />
          ) : (
            <FolderOpenIcon className="size-4 shrink-0" />
          )}
          <span className={hideLabel ? "hidden" : "hidden sm:inline"}>Projects</span>
        </button>
      </DropdownMenuTrigger>

      <BlueprintProjectsMenu
        disabled={disabled}
        loading={loading}
        connected={connected}
        attachedRepo={attachedRepo}
        workspaceDefaultRepo={workspaceDefaultRepo}
        repos={repos}
        onSelect={onSelect}
        onClose={() => setOpen(false)}
      />
    </DropdownMenu>
  )
}
