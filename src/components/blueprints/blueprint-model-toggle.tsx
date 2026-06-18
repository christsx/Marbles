"use client"

import * as React from "react"
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react"

import { BlueprintModelToggleGroup } from "@/components/blueprints/blueprint-model-toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MODEL_GROUP_ORDER, MODELS } from "@/lib/ai/model-catalog"
import {
  isModelAvailable,
  type ApiKeyState,
} from "@/lib/ai/model-availability"
import { cn } from "@/lib/utils"

type BlueprintModelToggleProps = {
  value: string
  onChange: (id: string) => void
  apiKeys?: ApiKeyState
  disabled?: boolean
}

export function BlueprintModelToggle({
  value,
  onChange,
  apiKeys,
  disabled = false,
}: BlueprintModelToggleProps) {
  const [open, setOpen] = React.useState(false)
  const selected = MODELS.find((model) => model.id === value)
  const selectedLabel = selected?.label ?? "Model"
  const selectedAvailable = apiKeys ? isModelAvailable(value, apiKeys) : true

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          title={
            !selectedAvailable
              ? "GROQ_API_KEY is missing"
              : "Choose Groq model"
          }
          className={cn(
            "blueprint-model-toggle",
            open && "is-open",
            disabled && "is-disabled"
          )}
        >
          {!selectedAvailable ? (
            <AlertCircleIcon className="size-3 shrink-0 text-destructive" />
          ) : null}
          <span className="max-w-[8.75rem] truncate">{selectedLabel}</span>
          <ChevronDownIcon
            className={cn(
              "size-3 shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="blueprint-model-menu w-56"
        side="top"
        align="end"
      >
        {MODEL_GROUP_ORDER.map((group) => (
          <BlueprintModelToggleGroup
            key={group}
            group={group}
            value={value}
            apiKeys={apiKeys}
            onChange={onChange}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
