"use client"

import * as React from "react"
import type { OutputData } from "@editorjs/editorjs"

import { BlueprintDocPreview } from "@/components/blueprints/blueprint-doc-preview"
import {
  BlueprintDocEmptyState,
  BlueprintDocLoadingState,
  BlueprintDocToolbar,
} from "@/components/blueprints/blueprint-doc-toolbar"
import {
  BlueprintEditor,
  type BlueprintEditorHandle,
} from "@/components/blueprints/blueprint-editor"
import { cn } from "@/lib/utils"

type BlueprintDocPanelProps = {
  title: string
  content: OutputData | null
  contentKey: number
  hasDocument: boolean
  generating: boolean
  panelMode?: "blueprint" | "template"
  startInEditMode?: boolean
  editorRef: React.RefObject<BlueprintEditorHandle | null>
  onSave?: () => void
  saving?: boolean
  saveDisabled?: boolean
  className?: string
}

export function BlueprintDocPanel({
  title,
  content,
  contentKey,
  hasDocument,
  generating,
  panelMode = "blueprint",
  startInEditMode = false,
  editorRef,
  onSave,
  saving = false,
  saveDisabled = false,
  className,
}: BlueprintDocPanelProps) {
  const [editing, setEditing] = React.useState(false)
  const isTemplate = panelMode === "template"

  React.useEffect(() => {
    if (hasDocument && !isTemplate) {
      setEditing(startInEditMode)
    }
  }, [hasDocument, contentKey, isTemplate, startInEditMode])

  return (
    <section
      className={cn(
        "blueprint-doc-panel relative flex min-h-0 min-w-0 flex-1 flex-col",
        className
      )}
    >
      {generating && !isTemplate ? (
        <BlueprintDocLoadingState />
      ) : !hasDocument || !content ? (
        <BlueprintDocEmptyState />
      ) : isTemplate ? (
        <div className="blueprint-doc-surface blueprint-doc-surface-read relative min-h-0 flex-1 overflow-y-auto">
          <BlueprintDocPreview
            content={content}
            title={title}
            contentKey={contentKey}
          />
        </div>
      ) : editing ? (
        <div className="blueprint-doc-surface blueprint-doc-surface-editing flex min-h-0 flex-1 flex-col overflow-hidden">
          <BlueprintDocToolbar
            onSave={onSave}
            saving={saving}
            saveDisabled={saveDisabled}
            editing={editing}
            onToggleEdit={() => setEditing(false)}
          />
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 md:px-6">
            <BlueprintEditor
              key={contentKey}
              ref={editorRef}
              initialData={content}
              minHeight={480}
            />
          </div>
        </div>
      ) : (
        <div className="blueprint-doc-surface blueprint-doc-surface-read relative min-h-0 flex-1 overflow-y-auto">
          <BlueprintDocToolbar
            onSave={onSave}
            saving={saving}
            saveDisabled={saveDisabled}
            editing={editing}
            onToggleEdit={() => setEditing(true)}
          />
          <BlueprintDocPreview
            content={content}
            title={title}
            contentKey={contentKey}
          />
        </div>
      )}
    </section>
  )
}
