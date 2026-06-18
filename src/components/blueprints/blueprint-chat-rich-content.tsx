"use client"

import * as React from "react"

import { BlueprintChatStreamTail } from "@/components/blueprints/blueprint-chat-stream-tail"
import { BlueprintChatMarkdownBlocks } from "@/components/blueprints/blueprint-chat-markdown-blocks"
import {
  parseChatMarkdown,
  splitStreamingDisplayText,
} from "@/lib/blueprints/parse-chat-markdown"

type BlueprintChatRichContentProps = {
  content: string
  streaming?: boolean
}

export function BlueprintChatRichContent({
  content,
  streaming = false,
}: BlueprintChatRichContentProps) {
  const { stable, tail } = streaming
    ? splitStreamingDisplayText(content)
    : { stable: content, tail: "" }

  const blocks = React.useMemo(
    () => (stable ? parseChatMarkdown(stable) : []),
    [stable]
  )

  if (!streaming && !content.trim()) {
    return null
  }

  return (
    <div className="blueprint-chat-markdown">
      {blocks.length ? <BlueprintChatMarkdownBlocks blocks={blocks} /> : null}
      {streaming ? <BlueprintChatStreamTail tail={tail} /> : null}
    </div>
  )
}
