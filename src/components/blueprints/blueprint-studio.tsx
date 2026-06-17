"use client"

import * as React from "react"
import { useActionState } from "react"
import type { OutputData } from "@editorjs/editorjs"

import { saveBlueprint, type SaveBlueprintState } from "@/app/dashboard/blueprints/actions"
import { BlueprintAgentChat } from "@/components/blueprints/blueprint-agent-chat"
import { BlueprintDocPanel } from "@/components/blueprints/blueprint-doc-panel"
import { BlueprintStudioShell } from "@/components/blueprints/blueprint-studio-shell"
import { useBlueprintStudioChat } from "@/components/blueprints/use-blueprint-studio-chat"
import type { BlueprintEditorHandle } from "@/components/blueprints/blueprint-editor"
import { emptyBlueprint } from "@/lib/blueprint-editor"
import { BLUEPRINT_GENERAL_SYSTEM } from "@/lib/blueprints"
import { cn } from "@/lib/utils"

const initialState: SaveBlueprintState = { status: "idle", message: "" }

type BlueprintStudioProps = {
  blueprintId?: string
  defaultTitle?: string
  defaultSystem?: string
  initialContent?: OutputData
}

export function BlueprintStudio({
  blueprintId,
  defaultTitle = "",
  defaultSystem = BLUEPRINT_GENERAL_SYSTEM,
  initialContent = emptyBlueprint,
}: BlueprintStudioProps) {
  const editorRef = React.useRef<BlueprintEditorHandle>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const isEditing = Boolean(blueprintId)
  const system = defaultSystem

  const [title, setTitle] = React.useState(defaultTitle)
  const [content, setContent] = React.useState<OutputData | null>(
    isEditing ? initialContent : null
  )
  const [hasDocument, setHasDocument] = React.useState(isEditing)
  const [contentKey, setContentKey] = React.useState(0)
  const [studioError, setStudioError] = React.useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(saveBlueprint, initialState)

  const { messages, setMessages, generating, docGenerating, handleSend, handleRetry } =
    useBlueprintStudioChat({
      title,
      system,
      hasDocument,
      editorRef,
      setTitle,
      setContent,
      setHasDocument,
      setContentKey,
      setStudioError,
    })

  React.useEffect(() => {
    if (!isEditing) return

    setMessages([
      {
        id: "loaded-assistant",
        role: "assistant",
        content:
          'Blueprint loaded. Chat is general by default — use + to add files or a GitHub repo when you want project context.',
      },
    ])
  }, [isEditing, setMessages])

  const errorMessage =
    studioError ?? (state.status === "error" ? state.message : null)
  const showDocPanel = hasDocument || docGenerating

  const handleSave = async () => {
    setStudioError(null)
    if (!formRef.current) return

    try {
      let doc = content
      if (editorRef.current) doc = await editorRef.current.save()
      if (!doc?.blocks?.length) {
        setStudioError("Blueprint document is empty.")
        return
      }

      const formData = new FormData(formRef.current)
      formData.set("title", title.trim() || "Untitled blueprint")
      formData.set("system", system)
      formData.set("content", JSON.stringify(doc))
      if (blueprintId) formData.set("blueprintId", blueprintId)
      formAction(formData)
    } catch {
      setStudioError("Failed to read document content.")
    }
  }

  return (
    <BlueprintStudioShell>
      <form ref={formRef} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {errorMessage ? (
          <div className="shrink-0 border-b border-destructive/30 bg-destructive/5 px-4 py-2 text-center text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 overflow-hidden flex-col lg:flex-row">
          <BlueprintAgentChat
            messages={messages}
            generating={generating}
            onSend={handleSend}
            onRetry={handleRetry}
            className={cn(showDocPanel && "lg:max-w-[min(52%,720px)]")}
          />

          {showDocPanel ? (
            <BlueprintDocPanel
              title={title}
              content={content}
              contentKey={contentKey}
              hasDocument={hasDocument}
              generating={docGenerating}
              editorRef={editorRef}
              onSave={handleSave}
              saving={isPending}
              saveDisabled={!hasDocument || generating}
            />
          ) : null}
        </div>
      </form>
    </BlueprintStudioShell>
  )
}
