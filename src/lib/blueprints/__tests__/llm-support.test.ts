import { describe, expect, it } from "vitest"

import { buildChatHistory } from "@/lib/blueprints/chat-history"
import { detectQueryFocus } from "@/lib/blueprints/query-focus"
import { finalizeChatMarkdown } from "@/lib/blueprints/finalize-chat-markdown"
import {
  classifyBlueprintIntent,
  updatesDocumentPanel,
} from "@/lib/blueprints/intent"
import { getStudioGreeting } from "@/lib/blueprints/studio-greeting"
import { resolveStudioDeliverable } from "@/lib/blueprints/workflow-prompt"

describe("detectQueryFocus", () => {
  it("detects codebase overview questions", () => {
    expect(
      detectQueryFocus("Explain what this app does from my repo").wantsCodebaseOverview
    ).toBe(true)
  })

  it("detects explicit diagram requests", () => {
    expect(detectQueryFocus("Draw a mermaid diagram of the flow").wantsExplicitDiagram).toBe(
      true
    )
  })

  it("detects client deliverable scope", () => {
    expect(
      detectQueryFocus("Client needs a scope document for automation").clientDeliverable
    ).toBe(true)
  })

  it("does not force diagram for short ack", () => {
    expect(detectQueryFocus("ok").wantsDiagram).toBe(false)
  })

  it("detects infra questions", () => {
    expect(detectQueryFocus("How is this deployed on Vercel?").infra).toBe(true)
  })
})

describe("buildChatHistory", () => {
  it("maps completed turns for Groq", () => {
    const history = buildChatHistory([
      { id: "1", role: "user", content: "Hello" },
      { id: "2", role: "assistant", content: "Hi there" },
    ])

    expect(history).toEqual([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
    ])
  })

  it("skips pending assistant messages", () => {
    const history = buildChatHistory([
      { id: "1", role: "user", content: "Hello" },
      { id: "2", role: "assistant", content: "", pending: true },
    ])

    expect(history).toEqual([{ role: "user", content: "Hello" }])
  })

  it("skips empty assistant content", () => {
    const history = buildChatHistory([
      { id: "1", role: "user", content: "Hi" },
      { id: "2", role: "assistant", content: "   " },
    ])

    expect(history).toHaveLength(1)
  })
})

describe("finalizeChatMarkdown", () => {
  it("normalizes em dashes to commas", () => {
    expect(finalizeChatMarkdown("Phase one — phase two.")).toBe(
      "Phase one, phase two."
    )
  })

  it("strips redacted thinking blocks", () => {
    const raw = "Visible<think>secret</think> tail."
    expect(finalizeChatMarkdown(raw)).toBe("Visible tail.")
  })
})

describe("getStudioGreeting", () => {
  it("includes first name when provided", () => {
    expect(getStudioGreeting("Christian")).toMatch(/Christian/)
  })

  it("omits name placeholder", () => {
    expect(getStudioGreeting("there")).not.toContain("there,")
  })
})

describe("LLM routing expectations", () => {
  it("attachment upload uses sow deliverable in pipeline", () => {
    expect(
      resolveStudioDeliverable({
        prompt: "",
        hasAttachments: true,
      })
    ).toBe("sow")
  })

  it("arc42 stays separate from chat deliverables", () => {
    const intent = classifyBlueprintIntent("Generate arc42 blueprint for payments", {
      hasDocument: false,
    })
    expect(intent).toBe("update_document")
    expect(updatesDocumentPanel(intent)).toBe(true)
  })

  it("chat SOW does not open arc42 panel", () => {
    const intent = classifyBlueprintIntent("Draft SOW for ClickUp automation", {
      hasDocument: false,
    })
    expect(intent).toBe("question")
    expect(updatesDocumentPanel(intent)).toBe(false)
  })
})
