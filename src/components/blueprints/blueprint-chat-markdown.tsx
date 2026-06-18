"use client"

import { BlueprintChatRichContent } from "@/components/blueprints/blueprint-chat-rich-content"

type BlueprintChatMarkdownProps = {
  content: string
}

export function BlueprintChatMarkdown({ content }: BlueprintChatMarkdownProps) {
  return <BlueprintChatRichContent content={content} />
}
