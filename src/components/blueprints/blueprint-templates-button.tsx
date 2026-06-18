"use client"

import * as React from "react"
import { CheckIcon, LayoutTemplateIcon } from "lucide-react"

import { BlueprintTemplatePickerModal } from "@/components/blueprints/blueprint-template-picker-modal"
import type { Workflow } from "@/lib/assistant/types"
import { cn } from "@/lib/utils"

type BlueprintTemplatesButtonProps = {
  disabled?: boolean
  hideLabel?: boolean
  selectedWorkflow: Workflow | null
  onSelect: (workflow: Workflow) => void
}

export function BlueprintTemplatesButton({
  disabled = false,
  hideLabel = false,
  selectedWorkflow,
  onSelect,
}: BlueprintTemplatesButtonProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        title={selectedWorkflow?.title ?? "Choose a template"}
        aria-label="Choose a template"
        onClick={() => setOpen(true)}
        className={cn(
          "blueprint-add-doc-button",
          selectedWorkflow && "has-selection",
          open && "is-open"
        )}
      >
        {selectedWorkflow ? (
          <CheckIcon className="size-4 shrink-0" />
        ) : (
          <LayoutTemplateIcon className="size-4 shrink-0" />
        )}
        <span className={hideLabel ? "hidden" : "hidden sm:inline"}>
          Templates
        </span>
      </button>

      <BlueprintTemplatePickerModal
        open={open}
        onClose={() => setOpen(false)}
        initialWorkflowId={selectedWorkflow?.id}
        onSelect={(workflow) => {
          onSelect(workflow)
          setOpen(false)
        }}
      />
    </>
  )
}
