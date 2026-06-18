"use client"

import { AppLogomark } from "@/components/app-logomark"
import { UploadIcon } from "lucide-react"

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type BlueprintAddDocMenuProps = {
  disabled?: boolean
  uploading: boolean
  onUploadClick: () => void
}

export function BlueprintAddDocMenu({
  disabled = false,
  uploading,
  onUploadClick,
}: BlueprintAddDocMenuProps) {
  return (
    <DropdownMenuContent
      className="blueprint-add-doc-menu w-44"
      side="bottom"
      align="start"
    >
      <DropdownMenuItem
        className="blueprint-add-doc-menu-item"
        disabled={disabled || uploading}
        onSelect={(event) => {
          event.preventDefault()
          onUploadClick()
        }}
      >
        {uploading ? (
          <AppLogomark spin size={16} className="mr-2 text-muted-foreground" />
        ) : (
          <UploadIcon className="mr-2 size-4 text-muted-foreground" />
        )}
        <span>{uploading ? "Uploading…" : "Upload files"}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
