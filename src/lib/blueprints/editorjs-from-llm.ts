import type { OutputData } from "@editorjs/editorjs"

import { sanitizeLlmText } from "@/lib/ai/sanitize-llm-text"
import { prepareMermaidSource } from "@/lib/blueprints/mermaid-render"

type BlueprintBlock = OutputData["blocks"][number]

type RawBlock = Record<string, unknown>

function repairBlueprintJson(raw: string) {
  const listBlockClose = "]" + "}" + "}" + ","

  return raw
    .replace(/\]\}\}\},/g, listBlockClose)
    .replace(/\}\}\},(\s*\{)/g, "},$1")
    .replace(/,\s*,/g, ",")
}

function parseJsonCandidate(raw: string): unknown {
  return JSON.parse(raw)
}

function extractJson(raw: string): unknown {
  const trimmed = sanitizeLlmText(raw)
  const candidates = [
    trimmed,
    repairBlueprintJson(trimmed),
  ]

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)

  if (fenced?.[1]) {
    candidates.push(fenced[1].trim(), repairBlueprintJson(fenced[1].trim()))
  }

  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")

  if (start >= 0 && end > start) {
    const slice = trimmed.slice(start, end + 1)
    candidates.push(slice, repairBlueprintJson(slice))
  }

  for (const candidate of candidates) {
    try {
      return parseJsonCandidate(candidate)
    } catch {
      continue
    }
  }

  throw new Error("Model response was not valid JSON.")
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim()
      }

      if (item && typeof item === "object" && "text" in item) {
        return asString((item as { text?: unknown }).text)
      }

      return null
    })
    .filter((item): item is string => Boolean(item))
}

function getBlockData(block: RawBlock): RawBlock {
  if (block.data && typeof block.data === "object") {
    return block.data as RawBlock
  }

  return block
}

function getBlockType(block: RawBlock): string {
  const type = asString(block.type) ?? "paragraph"

  if (type === "h1") return "header"
  if (type === "h2") return "header"
  if (type === "h3") return "header"

  return type
}

function getHeaderLevel(block: RawBlock, type: string): 1 | 2 | 3 {
  if (type === "h1") return 1
  if (type === "h2") return 2
  if (type === "h3") return 3

  const data = getBlockData(block)
  const level = data.level

  if (level === 1 || level === 2 || level === 3) {
    return level
  }

  return 2
}

function getText(block: RawBlock): string | null {
  const data = getBlockData(block)

  return (
    asString(data.text) ??
    asString(data.content) ??
    asString(block.content) ??
    asString(block.text)
  )
}

export function stripMermaidFences(source: string) {
  return source
    .replace(/^```(?:mermaid)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
}

export function isMermaidSource(code: string) {
  const sample = stripMermaidFences(code).toLowerCase()

  return (
    sample.startsWith("flowchart") ||
    sample.startsWith("graph ") ||
    sample.startsWith("sequencediagram") ||
    sample.startsWith("c4context") ||
    sample.startsWith("c4container") ||
    sample.startsWith("classdiagram") ||
    sample.startsWith("erdiagram")
  )
}

function diagramVariantForSection(section: string): string {
  const key = section.toLowerCase()

  if (key.includes("context")) return "context"
  if (key.includes("building")) return "containers"
  if (key.includes("runtime")) return "sequence"
  if (key.includes("deployment")) return "deployment"

  return "flowchart"
}

function toDiagramBlock(
  chart: string,
  sectionTitle: string,
  extra?: { title?: string; caption?: string; variant?: string }
): BlueprintBlock {
  return {
    type: "diagram",
    data: {
      title: extra?.title ?? sectionTitle,
      caption: extra?.caption ?? "",
      variant: extra?.variant ?? diagramVariantForSection(sectionTitle),
      chart: prepareMermaidSource(chart),
    },
  }
}

function normalizeBlock(block: unknown): BlueprintBlock | null {
  if (!block || typeof block !== "object") {
    return null
  }

  const raw = block as RawBlock
  const type = getBlockType(raw)
  const data = getBlockData(raw)

  switch (type) {
    case "header": {
      const text = getText(raw)

      if (!text) {
        return null
      }

      return {
        type: "header",
        data: { text, level: getHeaderLevel(raw, asString(raw.type) ?? "header") },
      }
    }
    case "paragraph": {
      const text = getText(raw)

      if (!text) {
        return null
      }

      if (isMermaidSource(text)) {
        return toDiagramBlock(text, "")
      }

      return { type: "paragraph", data: { text } }
    }
    case "list": {
      const items = asStringArray(data.items ?? raw.items)

      if (items.length === 0) {
        return null
      }

      const style = asString(data.style) ?? asString(raw.style)

      return {
        type: "list",
        data: {
          style: style === "ordered" ? "ordered" : "unordered",
          items,
        },
      }
    }
    case "checklist": {
      const rawItems = data.items ?? raw.items
      const items = Array.isArray(rawItems)
        ? rawItems
            .map((item) => {
              if (typeof item === "string") {
                return { text: item.trim(), checked: false }
              }

              if (item && typeof item === "object") {
                const record = item as { text?: unknown; checked?: unknown }
                const text = asString(record.text)

                if (!text) {
                  return null
                }

                return { text, checked: Boolean(record.checked) }
              }

              return null
            })
            .filter(
              (item): item is { text: string; checked: boolean } => item !== null
            )
        : []

      if (items.length === 0) {
        const fallback = asStringArray(rawItems)

        if (fallback.length === 0) {
          return null
        }

        return {
          type: "checklist",
          data: {
            items: fallback.map((text) => ({ text, checked: false })),
          },
        }
      }

      return { type: "checklist", data: { items } }
    }
    case "code": {
      const code =
        asString(data.code) ?? asString(raw.code) ?? getText(raw) ?? ""

      if (!code) {
        return null
      }

      if (isMermaidSource(code)) {
        return toDiagramBlock(code, "", {
          title: asString(data.title) ?? asString(raw.title) ?? "",
          caption: asString(data.caption) ?? asString(raw.caption) ?? "",
          variant: asString(data.variant) ?? asString(raw.variant) ?? "flowchart",
        })
      }

      return { type: "code", data: { code } }
    }
    case "diagram":
    case "mermaid": {
      const chart =
        asString(data.chart) ??
        asString(raw.chart) ??
        asString(data.code) ??
        asString(raw.code) ??
        getText(raw)

      if (!chart) {
        return null
      }

      return toDiagramBlock(chart, "", {
        title: asString(data.title) ?? asString(raw.title) ?? "",
        caption: asString(data.caption) ?? asString(raw.caption) ?? "",
        variant: asString(data.variant) ?? asString(raw.variant) ?? "flowchart",
      })
    }
    case "quote": {
      const text = getText(raw)

      if (!text) {
        return null
      }

      return {
        type: "quote",
        data: {
          text,
          caption: asString(data.caption) ?? asString(raw.caption) ?? "",
        },
      }
    }
    case "warning": {
      const title =
        asString(data.title) ?? asString(raw.title) ?? "Attention"
      const message =
        asString(data.message) ??
        asString(raw.message) ??
        getText(raw)

      if (!message) {
        return null
      }

      return { type: "warning", data: { title, message } }
    }
    case "delimiter":
      return { type: "delimiter", data: {} }
    default: {
      const text = getText(raw)

      if (!text) {
        return null
      }

      if (isMermaidSource(text)) {
        return toDiagramBlock(text, "")
      }

      return { type: "paragraph", data: { text } }
    }
  }
}

function collectBlocks(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) {
    return parsed
  }

  if (!parsed || typeof parsed !== "object") {
    return []
  }

  const record = parsed as Record<string, unknown>

  if (Array.isArray(record.blocks)) {
    return record.blocks
  }

  if (Array.isArray(record.sections)) {
    return record.sections.flatMap((section) => {
      if (!section || typeof section !== "object") {
        return []
      }

      const entry = section as Record<string, unknown>
      const heading = asString(entry.title) ?? asString(entry.name)
      const body = entry.blocks ?? entry.content ?? entry.items

      const blocks: unknown[] = []

      if (heading) {
        blocks.push({ type: "header", data: { text: heading, level: 2 } })
      }

      if (Array.isArray(body)) {
        blocks.push(...body)
      } else if (typeof body === "string") {
        blocks.push({ type: "paragraph", data: { text: body } })
      }

      return blocks
    })
  }

  return []
}

const SECTION_ALIASES: Record<string, string> = {
  goals: "Introduction and Goals",
  introduction: "Introduction and Goals",
  "introduction and goals": "Introduction and Goals",
  constraints: "Constraints",
  context: "Context and Scope",
  "context and scope": "Context and Scope",
  strategy: "Solution Strategy",
  "solution strategy": "Solution Strategy",
  "building blocks": "Building Block View",
  "building block view": "Building Block View",
  runtime: "Runtime View",
  "runtime view": "Runtime View",
  deployment: "Deployment View",
  "deployment view": "Deployment View",
  crosscutting: "Crosscutting Concepts",
  "crosscutting concepts": "Crosscutting Concepts",
  adrs: "Architecture Decisions",
  "architecture decisions": "Architecture Decisions",
  quality: "Quality Requirements",
  "quality requirements": "Quality Requirements",
  risks: "Risks and Technical Debt",
  "risks and technical debt": "Risks and Technical Debt",
  rollout: "Rollout Plan",
  "rollout plan": "Rollout Plan",
}

const SKIP_HEADER_LABELS = new Set([
  "context diagram",
  "building block diagram",
  "runtime diagram",
  "deployment diagram",
  "system context",
  "container view",
])

function canonicalSectionTitle(text: string) {
  const key = text.trim().toLowerCase().replace(/\s+/g, " ")

  if (SKIP_HEADER_LABELS.has(key)) {
    return null
  }

  return SECTION_ALIASES[key] ?? text.trim()
}

function sectionsMatch(a: string, b: string) {
  if (!a || !b) {
    return false
  }

  return canonicalSectionTitle(a) === canonicalSectionTitle(b)
}

function isDiagramBlock(block: BlueprintBlock) {
  return block.type === "diagram"
}

function hasRecentDiagram(blocks: BlueprintBlock[]) {
  for (let i = blocks.length - 1; i >= Math.max(0, blocks.length - 3); i--) {
    if (isDiagramBlock(blocks[i])) {
      return true
    }
  }

  return false
}

function mermaidFingerprint(source: string) {
  return prepareMermaidSource(source).replace(/\s+/g, " ").trim().toLowerCase()
}

function diagramTitleForSection(section: string, proposed?: string) {
  if (!proposed?.trim()) {
    return ""
  }

  if (sectionsMatch(proposed, section)) {
    return ""
  }

  return proposed.trim()
}

export function polishBlueprintBlocks(blocks: BlueprintBlock[]): BlueprintBlock[] {
  const polished: BlueprintBlock[] = []
  const seenSections = new Set<string>()
  let currentSection = ""
  let lastDiagramFingerprint = ""

  for (const block of blocks) {
    if (block.type === "header") {
      const header = block.data as { text: string; level: number }

      if (header.level === 2) {
        const canonical = canonicalSectionTitle(header.text)

        if (!canonical) {
          continue
        }

        if (seenSections.has(canonical) || (hasRecentDiagram(polished) && sectionsMatch(header.text, currentSection))) {
          continue
        }

        seenSections.add(canonical)
        currentSection = canonical
        polished.push({
          type: "header",
          data: { text: canonical, level: 2 },
        })
        continue
      }

      polished.push(block)
      continue
    }

    if (block.type === "code") {
      const code = (block.data as { code: string }).code

      if (isMermaidSource(code)) {
        const fingerprint = mermaidFingerprint(code)

        if (fingerprint === lastDiagramFingerprint) {
          continue
        }

        lastDiagramFingerprint = fingerprint
        polished.push(
          toDiagramBlock(code, currentSection, {
            title: "",
            variant: diagramVariantForSection(currentSection),
          })
        )
      }

      continue
    }

    if (block.type === "paragraph") {
      const text = (block.data as { text: string }).text

      if (isMermaidSource(text)) {
        const fingerprint = mermaidFingerprint(text)

        if (fingerprint === lastDiagramFingerprint) {
          continue
        }

        lastDiagramFingerprint = fingerprint
        polished.push(
          toDiagramBlock(text, currentSection, {
            title: "",
            variant: diagramVariantForSection(currentSection),
          })
        )
        continue
      }
    }

    if (block.type === "diagram") {
      const data = block.data as {
        title?: string
        caption?: string
        variant?: string
        chart: string
      }

      const fingerprint = mermaidFingerprint(data.chart)

      if (fingerprint === lastDiagramFingerprint) {
        continue
      }

      lastDiagramFingerprint = fingerprint
      polished.push(
        toDiagramBlock(data.chart, currentSection, {
          title: diagramTitleForSection(currentSection, data.title),
          caption: data.caption,
          variant: data.variant ?? diagramVariantForSection(currentSection),
        })
      )
      continue
    }

    polished.push(block)
  }

  return polished
}

export function parseBlueprintOutput(raw: string): OutputData {
  const parsed = extractJson(raw)
  const rawBlocks = collectBlocks(parsed)

  if (rawBlocks.length === 0) {
    throw new Error("Blueprint JSON must include a blocks array.")
  }

  const blocks = polishBlueprintBlocks(
    rawBlocks
      .map((block) => normalizeBlock(block))
      .filter((block): block is BlueprintBlock => block !== null)
  )

  if (blocks.length === 0) {
    throw new Error("Blueprint JSON did not contain usable blocks.")
  }

  return {
    time: Date.now(),
    blocks,
  }
}
