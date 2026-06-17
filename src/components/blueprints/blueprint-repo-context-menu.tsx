"use client"

import { ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  blueprintSystemOptions,
  getBlueprintSystemOption,
} from "@/lib/blueprints"
import { cn } from "@/lib/utils"

type BlueprintRepoContextMenuProps = {
  system: string
  disabled?: boolean
  onSystemChange: (system: string) => void
}

export function BlueprintRepoContextMenu({
  system,
  disabled = false,
  onSystemChange,
}: BlueprintRepoContextMenuProps) {
  const selected = getBlueprintSystemOption(system)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Repository context"
          className={cn(
            "blueprint-context-trigger blueprint-composer-chip outline-none",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {selected.label}
          <ChevronDownIcon className="size-4 shrink-0 stroke-[2.25] opacity-70" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="blueprint-context-menu w-64 border border-border bg-popover p-1 shadow-lg"
      >
        <DropdownMenuRadioGroup value={system} onValueChange={onSystemChange}>
          {blueprintSystemOptions.map((option) => (
            <DropdownMenuRadioItem
              key={option.id}
              value={option.id}
              className={cn(
                "blueprint-menu-item blueprint-context-item",
                "focus:bg-muted data-[highlighted]:bg-muted",
                "data-[state=checked]:bg-transparent",
                "data-[state=checked]:focus:bg-transparent",
                "data-[state=checked]:data-[highlighted]:bg-transparent",
                "data-[state=checked]:focus:text-foreground",
                "data-[state=checked]:data-[highlighted]:text-foreground"
              )}
            >
              <span className="blueprint-menu-item-copy">
                <span className="blueprint-menu-item-title">{option.label}</span>
                <span className="blueprint-menu-item-hint">{option.description}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
