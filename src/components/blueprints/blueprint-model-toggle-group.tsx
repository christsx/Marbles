"use client"

import { AlertCircleIcon, CheckIcon } from "lucide-react"

import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { MODELS, type ModelGroup } from "@/lib/ai/model-catalog"
import {
  isModelAvailable,
  type ApiKeyState,
} from "@/lib/ai/model-availability"
import { cn } from "@/lib/utils"

type BlueprintModelToggleGroupProps = {
  group: ModelGroup
  value: string
  apiKeys?: ApiKeyState
  onChange: (id: string) => void
}

export function BlueprintModelToggleGroup({
  group,
  value,
  apiKeys,
  onChange,
}: BlueprintModelToggleGroupProps) {
  const items = MODELS.filter((model) => model.group === group)

  if (items.length === 0) {
    return null
  }

  return (
    <div>
      <DropdownMenuLabel className="blueprint-model-menu-label">
        {group}
      </DropdownMenuLabel>
      {items.map((model) => {
        const available = apiKeys ? isModelAvailable(model.id, apiKeys) : true

        return (
          <DropdownMenuItem
            key={model.id}
            className="blueprint-model-menu-item"
            onSelect={() => onChange(model.id)}
          >
            <span className={cn("flex-1", !available && "text-muted-foreground")}>
              {model.label}
            </span>
            {!available ? (
              <AlertCircleIcon
                className="ml-1 size-3.5 text-destructive"
                aria-label="API key missing"
              />
            ) : null}
            {model.id === value && available ? (
              <CheckIcon className="ml-1 size-3.5 text-foreground" />
            ) : null}
          </DropdownMenuItem>
        )
      })}
    </div>
  )
}
