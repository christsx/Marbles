"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"

import { BlueprintAddMenu } from "@/components/blueprints/blueprint-add-menu"
import { BlueprintContextChips } from "@/components/blueprints/blueprint-context-chips"
import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"
import { cn } from "@/lib/utils"

const INPUT_MAX_HEIGHT = 160

function useAutoResizeTextarea(
  value: string,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) {
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "0px"
    textarea.style.height = `${Math.min(textarea.scrollHeight, INPUT_MAX_HEIGHT)}px`
  }, [value, textareaRef])
}

export type BlueprintComposerProps = {
  input: string
  generating: boolean
  projectContext: BlueprintProjectContext
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onInput: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  onAttachFiles: (files: BlueprintProjectContext["attachments"]) => void
  onToggleRepo: () => void
  onRemoveRepo: () => void
  onRemoveAttachment: (id: string) => void
  large?: boolean
}

export function BlueprintComposer({
  input,
  generating,
  projectContext,
  textareaRef,
  onInput,
  onKeyDown,
  onSubmit,
  onAttachFiles,
  onToggleRepo,
  onRemoveRepo,
  onRemoveAttachment,
  large = false,
}: BlueprintComposerProps) {
  useAutoResizeTextarea(input, textareaRef)

  const canSend =
    (input.trim().length > 0 || projectContext.attachments.length > 0) &&
    !generating

  return (
    <div
      className={cn("blueprint-composer group w-full", large && "blueprint-composer-large")}
    >
      <BlueprintContextChips
        context={projectContext}
        disabled={generating}
        onRemoveRepo={onRemoveRepo}
        onRemoveAttachment={onRemoveAttachment}
        className="px-3 pt-3"
      />

      <textarea
        ref={textareaRef}
        value={input}
        onChange={onInput}
        onKeyDown={onKeyDown}
        placeholder="Write a message…"
        disabled={generating}
        rows={1}
        aria-label="Blueprint prompt"
        className="blueprint-composer-input w-full resize-none bg-transparent outline-none focus:outline-none focus-visible:outline-none"
      />

      <div className="blueprint-composer-toolbar">
        <BlueprintAddMenu
          disabled={generating}
          repoEnabled={projectContext.repoEnabled}
          onAttachFiles={onAttachFiles}
          onToggleRepo={onToggleRepo}
        />

        <div className="blueprint-composer-toolbar-right">
          <div className="blueprint-composer-send-slot">
            {canSend ? (
              <button
                type="button"
                aria-label="Send"
                onClick={onSubmit}
                className="blueprint-composer-action blueprint-composer-action-send blueprint-composer-chip"
              >
                <ArrowUpIcon className="size-[18px] stroke-[2.5]" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
