"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"

import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { cn } from "@/lib/utils"

type BlueprintChatActionsProps = {
  content: string
  prompt?: string
  onRetry?: () => void
  className?: string
}

export function BlueprintChatActions({
  content,
  prompt,
  onRetry,
  className,
}: BlueprintChatActionsProps) {
  const showDownload = isMarkdownFileRequest(prompt)
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null)

  const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const ok = await copyTextToClipboard(content)
    setCopied(ok)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const download = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = deriveMarkdownFileName(content)
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
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
      {showDownload ? (
        <ActionButton label="Download .md" onClick={download}>
          <DownloadIcon className="size-4" />
        </ActionButton>
      ) : null}
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

function isMarkdownFileRequest(prompt?: string | null): boolean {
  if (!prompt) return false
  return /\bmarkdown\b/i.test(prompt) || /\.md\b/i.test(prompt)
}

function deriveMarkdownFileName(content: string): string {
  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0)

  if (!firstLine) return "response.md"

  const heading = firstLine.replace(/^#+\s*/, "").replace(/[*_`]/g, "")
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)

  return `${slug || "response"}.md`
}
