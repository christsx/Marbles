"use client"

import type { OutputData } from "@editorjs/editorjs"

import { BlueprintDocument } from "@/components/blueprints/blueprint-document"

export function normalizeDocTitle(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function isDuplicateTitleBlock(
  block: OutputData["blocks"][number],
  index: number,
  title: string
) {
  if (index !== 0 || block.type !== "header") {
    return false
  }

  const data = block.data as { text?: string; level?: number }

  return (
    data.level === 1 &&
    normalizeDocTitle(data.text ?? "") === normalizeDocTitle(title)
  )
}

export function getDisplayBlocks(content: OutputData, title: string) {
  return content.blocks.filter(
    (block, index) => !isDuplicateTitleBlock(block, index, title)
  )
}

export function BlueprintDocPreview({
  content,
  title,
  contentKey,
}: {
  content: OutputData
  title: string
  contentKey: number
}) {
  const blocks = getDisplayBlocks(content, title)

  return (
    <article className="blueprint-doc-article mx-auto max-w-3xl px-6 py-8 md:px-10">
      <BlueprintDocument key={contentKey} content={{ blocks }} />
    </article>
  )
}
