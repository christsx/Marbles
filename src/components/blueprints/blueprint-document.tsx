import type { OutputData } from "@editorjs/editorjs"

import { cn } from "@/lib/utils"

type Block = OutputData["blocks"][number]

function HeaderBlock({ data }: { data: { text: string; level: number } }) {
  const Tag = data.level === 1 ? "h1" : data.level === 2 ? "h2" : "h3"
  return (
    <Tag
      className={cn(
        "font-heading font-semibold tracking-tight",
        data.level === 1 && "text-2xl",
        data.level === 2 && "text-lg",
        data.level === 3 && "text-base"
      )}
      dangerouslySetInnerHTML={{ __html: data.text }}
    />
  )
}

function ParagraphBlock({ data }: { data: { text: string } }) {
  return (
    <p
      className="text-sm leading-relaxed text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: data.text }}
    />
  )
}

function ListBlock({
  data,
}: {
  data: { style: "ordered" | "unordered"; items: string[] }
}) {
  const Tag = data.style === "ordered" ? "ol" : "ul"
  return (
    <Tag
      className={cn(
        "ml-4 text-sm leading-relaxed text-muted-foreground",
        data.style === "ordered" ? "list-decimal" : "list-disc"
      )}
    >
      {data.items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </Tag>
  )
}

function ChecklistBlock({
  data,
}: {
  data: { items: { text: string; checked: boolean }[] }
}) {
  return (
    <ul className="flex flex-col gap-2">
      {data.items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border text-[10px]",
              item.checked
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "border-border bg-muted/50 text-transparent"
            )}
          >
            ✓
          </span>
          <span
            className={cn(
              "leading-relaxed",
              item.checked ? "text-muted-foreground line-through" : "text-foreground"
            )}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        </li>
      ))}
    </ul>
  )
}

function QuoteBlock({ data }: { data: { text: string; caption?: string } }) {
  return (
    <blockquote className="border-l-2 border-border pl-4">
      <p
        className="text-sm leading-relaxed text-muted-foreground italic"
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
      {data.caption && (
        <footer
          className="mt-1 text-xs text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: data.caption }}
        />
      )}
    </blockquote>
  )
}

function CodeBlock({ data }: { data: { code: string } }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
      <code>{data.code}</code>
    </pre>
  )
}

function WarningBlock({
  data,
}: {
  data: { title: string; message: string }
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
      <p className="text-sm font-medium">{data.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{data.message}</p>
    </div>
  )
}

function DelimiterBlock() {
  return <hr className="border-border/60" />
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "header":
      return <HeaderBlock data={block.data as { text: string; level: number }} />
    case "paragraph":
      return <ParagraphBlock data={block.data as { text: string }} />
    case "list":
      return (
        <ListBlock
          data={block.data as { style: "ordered" | "unordered"; items: string[] }}
        />
      )
    case "checklist":
      return (
        <ChecklistBlock
          data={block.data as { items: { text: string; checked: boolean }[] }}
        />
      )
    case "quote":
      return (
        <QuoteBlock data={block.data as { text: string; caption?: string }} />
      )
    case "code":
      return <CodeBlock data={block.data as { code: string }} />
    case "warning":
      return (
        <WarningBlock data={block.data as { title: string; message: string }} />
      )
    case "delimiter":
      return <DelimiterBlock />
    default:
      return null
  }
}

export function BlueprintDocument({
  content,
  className,
}: {
  content: OutputData
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {content.blocks.map((block, i) => (
        <div key={`${block.type}-${i}`}>
          <BlockRenderer block={block} />
        </div>
      ))}
    </div>
  )
}
