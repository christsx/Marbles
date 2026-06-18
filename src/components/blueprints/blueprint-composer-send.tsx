"use client"

import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type BlueprintComposerSendProps = {
  disabled: boolean
  onClick: () => void
}

export function BlueprintComposerSend({
  disabled,
  onClick,
}: BlueprintComposerSendProps) {
  return (
    <button
      type="button"
      aria-label="Send message"
      disabled={disabled}
      onClick={onClick}
      className={cn("blueprint-composer-send", disabled && "is-disabled")}
    >
      <ArrowRightIcon className="size-4" />
    </button>
  )
}
