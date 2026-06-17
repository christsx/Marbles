"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"

import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { cn } from "@/lib/utils"

type BlueprintChatActionsProps = {
  content: string
  onRetry?: () => void
  className?: string
}

export function BlueprintChatActions({
  content,
  onRetry,
  className,
}: BlueprintChatActionsProps) {
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null)

  const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const ok = await copyTextToClipboard(content)
    setCopied(ok)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const setThumb = (value: "up" | "down") => {
    setFeedback((current) => (current === value ? null : value))
  }

  return (
    <div className={cn("blueprint-chat-actions", className)}>
      <ActionButton
        label={copied ? "Copied" : "Copy"}
        onClick={copy}
        active={copied}
      >
        {copied ? (
          <CheckIcon className="size-4" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </ActionButton>
      <ActionButton
        label="Good response"
        onClick={() => setThumb("up")}
        active={feedback === "up"}
      >
        <ThumbsUpIcon
          className={cn("size-4", feedback === "up" && "fill-current")}
        />
      </ActionButton>
      <ActionButton
        label="Bad response"
        onClick={() => setThumb("down")}
        active={feedback === "down"}
      >
        <ThumbsDownIcon
          className={cn("size-4", feedback === "down" && "fill-current")}
        />
      </ActionButton>
      {onRetry ? (
        <ActionButton label="Retry" onClick={() => onRetry()}>
          <RefreshCwIcon className="size-4" />
        </ActionButton>
      ) : null}
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClick(event)
      }}
      className={cn("blueprint-chat-action", active && "is-active")}
    >
      {children}
    </button>
  )
}
