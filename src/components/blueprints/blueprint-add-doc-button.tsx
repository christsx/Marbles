"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { BlueprintAddDocMenu } from "@/components/blueprints/blueprint-add-doc-menu"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BLUEPRINT_DOC_ACCEPT,
  filesToBlueprintAttachments,
} from "@/lib/blueprints/add-doc-files"
import type { BlueprintAttachment } from "@/lib/blueprints/project-context.types"
import { cn } from "@/lib/utils"

type BlueprintAddDocButtonProps = {
  disabled?: boolean
  hideLabel?: boolean
  repoEnabled: boolean
  selectedCount: number
  onAttachFiles: (attachments: BlueprintAttachment[]) => void
  onToggleRepo: () => void
}

export function BlueprintAddDocButton({
  disabled = false,
  hideLabel = false,
  repoEnabled,
  selectedCount,
  onAttachFiles,
  onToggleRepo,
}: BlueprintAddDocButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const uploadInputRef = React.useRef<HTMLInputElement>(null)
  const browseInputRef = React.useRef<HTMLInputElement>(null)

  const attachFromInput = React.useCallback(
    (files: FileList | null) => {
      const attachments = filesToBlueprintAttachments(files)
      if (attachments.length) onAttachFiles(attachments)
    },
    [onAttachFiles]
  )

  return (
    <>
      <input
        ref={uploadInputRef}
        type="file"
        accept={BLUEPRINT_DOC_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          setUploading(true)
          try {
            attachFromInput(event.target.files)
          } finally {
            setUploading(false)
            if (uploadInputRef.current) uploadInputRef.current.value = ""
          }
        }}
      />
      <input
        ref={browseInputRef}
        type="file"
        accept={BLUEPRINT_DOC_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          attachFromInput(event.target.files)
          if (browseInputRef.current) browseInputRef.current.value = ""
        }}
      />

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            title="Add documents"
            aria-label="Add documents"
            className={cn(
              "blueprint-add-doc-button",
              selectedCount > 0 && "has-selection",
              open && "is-open"
            )}
          >
            {selectedCount > 0 ? (
              <span className="font-medium tabular-nums">{selectedCount}</span>
            ) : (
              <PlusIcon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-300",
                  open && "rotate-[135deg]"
                )}
              />
            )}
            <span className={hideLabel ? "hidden" : "hidden sm:inline"}>
              {selectedCount === 1 ? "Document" : "Documents"}
            </span>
          </button>
        </DropdownMenuTrigger>

        <BlueprintAddDocMenu
          disabled={disabled}
          uploading={uploading}
          repoEnabled={repoEnabled}
          onUploadClick={() => uploadInputRef.current?.click()}
          onBrowseClick={() => browseInputRef.current?.click()}
          onToggleRepo={onToggleRepo}
        />
      </DropdownMenu>
    </>
  )
}
