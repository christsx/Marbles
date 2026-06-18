"use client"

import Link from "next/link"
import { GitBranchIcon } from "lucide-react"

import { AppLogomark } from "@/components/app-logomark"
import { setActiveRepoAction } from "@/app/dashboard/integrations/actions"
import { BlueprintProjectsRepoList } from "@/components/blueprints/blueprint-projects-repo-list"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type BlueprintProjectsMenuProps = {
  disabled?: boolean
  loading: boolean
  connected: boolean
  attachedRepo: string | null
  workspaceDefaultRepo: string | null
  repos: string[]
  onSelect: (fullName: string) => void
  onClose: () => void
}

export function BlueprintProjectsMenu({
  disabled = false,
  loading,
  connected,
  attachedRepo,
  workspaceDefaultRepo,
  repos,
  onSelect,
  onClose,
}: BlueprintProjectsMenuProps) {
  const canQuickAttach =
    Boolean(workspaceDefaultRepo) &&
    attachedRepo !== workspaceDefaultRepo &&
    repos.includes(workspaceDefaultRepo ?? "")

  return (
    <DropdownMenuContent
      className="blueprint-add-doc-menu"
      side="bottom"
      align="start"
    >
      {loading ? (
        <DropdownMenuItem disabled className="blueprint-add-doc-menu-item">
          <AppLogomark spin size={16} className="mr-2 text-muted-foreground" />
          <span>Loading…</span>
        </DropdownMenuItem>
      ) : !connected ? (
        <DropdownMenuItem asChild className="blueprint-add-doc-menu-item">
          <Link href="/dashboard/integrations" prefetch onClick={onClose}>
            <GitBranchIcon className="mr-2 size-4 text-muted-foreground" />
            <span>Connect GitHub</span>
          </Link>
        </DropdownMenuItem>
      ) : repos.length === 0 ? (
        <DropdownMenuItem asChild className="blueprint-add-doc-menu-item">
          <Link href="/dashboard/integrations" prefetch onClick={onClose}>
            <GitBranchIcon className="mr-2 size-4 text-muted-foreground" />
            <span>Add GitHub repo</span>
          </Link>
        </DropdownMenuItem>
      ) : (
        <>
          {canQuickAttach ? (
            <DropdownMenuItem
              disabled={disabled}
              className="blueprint-add-doc-menu-item"
              title={workspaceDefaultRepo ?? undefined}
              onSelect={() => {
                void (async () => {
                  const result = await setActiveRepoAction(workspaceDefaultRepo!)
                  if (result.ok) onSelect(workspaceDefaultRepo!)
                  onClose()
                })()
              }}
            >
              <GitBranchIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">
                Use {workspaceDefaultRepo!.split("/")[1] ?? workspaceDefaultRepo}
              </span>
            </DropdownMenuItem>
          ) : null}
          {canQuickAttach ? <DropdownMenuSeparator /> : null}
          <BlueprintProjectsRepoList
            disabled={disabled}
            attachedRepo={attachedRepo}
            workspaceDefaultRepo={workspaceDefaultRepo}
            repos={repos}
            onSelect={onSelect}
            onClose={onClose}
          />
        </>
      )}

      {connected && repos.length > 0 ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="blueprint-add-doc-menu-item">
            <Link href="/dashboard/integrations" prefetch onClick={onClose}>
              <span className={cn("pl-6 text-muted-foreground")}>Manage repos</span>
            </Link>
          </DropdownMenuItem>
        </>
      ) : null}
    </DropdownMenuContent>
  )
}
