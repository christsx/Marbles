"use client"

import dynamic from "next/dynamic"

import {
  parseChatMarkdown,
  splitInlineMarkdown,
} from "@/lib/blueprints/parse-chat-markdown"

const MermaidDiagram = dynamic(
  () =>
    import("@/components/blueprints/mermaid-diagram").then((mod) => ({
      default: mod.MermaidDiagram,
    })),
  { ssr: false }
)

type BlueprintChatMarkdownProps = {
  content: string
}

export function BlueprintChatMarkdown({ content }: BlueprintChatMarkdownProps) {
  const blocks = parseChatMarkdown(content)

  return (
    <div className="blueprint-chat-markdown">
      {blocks.map((block, index) => {
        if (block.type === "hr") {
          return <hr key={`hr-${index}`} className="blueprint-chat-hr" />
        }

        if (block.type === "heading") {
          return (
            <h3 key={`h-${index}`} className="blueprint-chat-heading">
              <InlineText text={block.text} />
            </h3>
          )
        }

        if (block.type === "list") {
          return (
            <ul key={`ul-${index}`} className="blueprint-chat-list">
              {block.items.map((item, itemIndex) => (
                <li key={`li-${index}-${itemIndex}`}>
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === "diagram") {
          return (
            <div key={`diagram-${index}`} className="blueprint-chat-diagram">
              <MermaidDiagram chart={block.chart} />
            </div>
          )
        }

        return (
          <p key={`p-${index}`} className="blueprint-chat-paragraph">
            <InlineText text={block.text} />
          </p>
        )
      })}
    </div>
  )
}

function InlineText({ text }: { text: string }) {
  return (
    <>
      {splitInlineMarkdown(text).map((part, index) =>
        part.bold ? (
          <strong key={index}>{part.text}</strong>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  )
}
