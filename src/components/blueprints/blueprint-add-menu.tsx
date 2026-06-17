"use client"

import * as React from "react"
import {
  FileUpIcon,
  GitBranchIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BlueprintAttachment } from "@/lib/blueprints/project-context.types"
import { cn } from "@/lib/utils"

const FILE_ACCEPT =
  "image/*,.pdf,.doc,.docx,.txt,.md,.markdown,.json,.yaml,.yml,.csv"
const SKILL_ACCEPT = ".md,.markdown,.txt"

type BlueprintAddMenuProps = {
  disabled?: boolean
  repoEnabled: boolean
  onAttachFiles: (attachments: BlueprintAttachment[]) => void
  onToggleRepo: () => void
}

export function BlueprintAddMenu({
  disabled = false,
  repoEnabled,
  onAttachFiles,
  onToggleRepo,
}: BlueprintAddMenuProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const skillInputRef = React.useRef<HTMLInputElement>(null)

  const openPicker = (input: HTMLInputElement | null) => {
    if (!input) return
    input.value = ""
    input.click()
  }

  const handleFiles = (
    files: FileList | null,
    kind: BlueprintAttachment["kind"]
  ) => {
    if (!files?.length) return

    onAttachFiles(
      Array.from(files).map((file) => ({
        id: `${kind}-${file.name}-${file.lastModified}`,
        kind,
        file,
        label: file.name,
      }))
    )
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={FILE_ACCEPT}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files, "file")}
      />
      <input
        ref={skillInputRef}
        type="file"
        multiple
        accept={SKILL_ACCEPT}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files, "skill")}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label="Add to project"
            className={cn(
              "blueprint-composer-action blueprint-composer-chip",
              "data-[state=open]:bg-muted data-[state=open]:text-foreground"
            )}
          >
            <PlusIcon className="size-5 stroke-[2.25]" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="blueprint-attach-menu w-56 border border-border bg-popover p-1 shadow-lg"
        >
          <AddMenuItem
            icon={FileUpIcon}
            title="Upload files"
            hint="Docs, images, PDFs"
            onClick={() => openPicker(fileInputRef.current)}
          />
          <AddMenuItem
            icon={SparklesIcon}
            title="Add skill"
            hint="Markdown instructions"
            onClick={() => openPicker(skillInputRef.current)}
          />
          <AddMenuItem
            icon={GitBranchIcon}
            title={repoEnabled ? "Remove GitHub repo" : "Add GitHub repo"}
            hint="Optional project context"
            onClick={onToggleRepo}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function AddMenuItem({
  icon: Icon,
  title,
  hint,
  disabled = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  hint: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <DropdownMenuItem
      disabled={disabled}
      className="blueprint-menu-item blueprint-attach-item"
      onClick={onClick}
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="blueprint-menu-item-copy">
        <span className="blueprint-menu-item-title">{title}</span>
        <span className="blueprint-menu-item-hint">{hint}</span>
      </span>
    </DropdownMenuItem>
  )
}
