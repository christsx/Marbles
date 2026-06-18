import { describe, expect, it } from "vitest"

import {
  normalizeChatProse,
  parseChatMarkdown,
  prepareStreamingChatMarkdown,
  prepareStreamingDisplayText,
  splitStreamingDisplayText,
} from "@/lib/blueprints/parse-chat-markdown"

describe("normalizeChatProse", () => {
  it("strips leading Hey Christian em-dash opener", () => {
    expect(
      normalizeChatProse("Hey Christian — here's the plan for ClickUp.")
    ).toBe("here's the plan for ClickUp.")
  })

  it("converts chatty opener dash to Got it", () => {
    expect(normalizeChatProse("No worries — take your time.")).toBe(
      "Got it. take your time."
    )
  })

  it("strips engagement bait at the end", () => {
    expect(
      normalizeChatProse("Done.\n\nLet me know if you'd like to refine this.")
    ).toBe("Done.")
  })

  it("strips whats on your mind opener", () => {
    expect(normalizeChatProse("What's on your mind?")).toBe("")
  })
})

describe("prepareStreamingDisplayText", () => {
  it("hides partial greeting before dash arrives", () => {
    expect(prepareStreamingDisplayText("Hey Christian")).toBe("")
  })

  it("shows text after greeting opener is stripped", () => {
    expect(
      prepareStreamingDisplayText("Hey there — summarize the automation doc.")
    ).toBe("summarize the automation doc.")
  })

  it("trims incomplete markdown heading at end", () => {
    expect(prepareStreamingDisplayText("Hello\n\n## Implementation")).toBe(
      "Hello\n"
    )
  })

  it("trims incomplete horizontal rule at end", () => {
    expect(prepareStreamingDisplayText("Section one\n\n---")).toBe(
      "Section one\n"
    )
  })

  it("preserves a trailing newline between paragraphs", () => {
    expect(prepareStreamingDisplayText("Line one\nLine two\n")).toBe(
      "Line one\nLine two\n"
    )
  })

  it("does not strip engagement bait mid-stream", () => {
    expect(
      prepareStreamingDisplayText("Done.\n\nLet me know if you'd like")
    ).toBe("Done.\n\nLet me know if you'd like")
  })
})

describe("splitStreamingDisplayText", () => {
  it("keeps a single in-progress line in the tail", () => {
    expect(splitStreamingDisplayText("## Overview")).toEqual({
      stable: "",
      tail: "## Overview",
    })
  })

  it("parses completed lines into stable and keeps the last line in tail", () => {
    expect(
      splitStreamingDisplayText("## Overview\n\nAutomate folder creation")
    ).toEqual({
      stable: "## Overview\n",
      tail: "Automate folder creation",
    })
  })

  it("moves a finished paragraph into stable when the stream ends with a newline", () => {
    expect(splitStreamingDisplayText("Line one\nLine two\n")).toEqual({
      stable: "Line one\nLine two",
      tail: "",
    })
  })
})

describe("prepareStreamingChatMarkdown", () => {
  it("trims trailing whitespace for legacy callers", () => {
    expect(prepareStreamingChatMarkdown("Hello\n\n")).toBe("Hello")
  })
})

describe("parseChatMarkdown", () => {
  it("parses headings and bullet lists", () => {
    const blocks = parseChatMarkdown("## Overview\n\n- Task one\n- Task two")
    expect(blocks.some((b) => b.type === "heading")).toBe(true)
    expect(blocks.some((b) => b.type === "list")).toBe(true)
  })

  it("parses consecutive numbered items", () => {
    const blocks = parseChatMarkdown(
      "1. Configure ClickUp space\n2. Copy template tasks\n3. Notify Amber"
    )
    const list = blocks.find((b) => b.type === "list")
    expect(list?.type).toBe("list")
    if (list?.type === "list") {
      expect(list.items).toHaveLength(3)
    }
  })
})
