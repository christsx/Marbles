import { describe, expect, it } from "vitest"

import {
  classifyBlueprintIntent,
  detectDeliverableKind,
  updatesDocumentPanel,
} from "@/lib/blueprints/intent"

describe("detectDeliverableKind", () => {
  it("detects SOW from explicit phrase", () => {
    expect(detectDeliverableKind("Draft a scope of work for the client")).toBe(
      "sow"
    )
  })

  it("detects SOW from client proposal language", () => {
    expect(
      detectDeliverableKind("Client wants a proposal document for automation")
    ).toBe("sow")
  })

  it("detects SOW from scoping automation", () => {
    expect(detectDeliverableKind("Scoping an automation project")).toBe("sow")
  })

  it("detects PRD", () => {
    expect(detectDeliverableKind("Write a product requirements doc")).toBe("prd")
  })

  it("detects spec", () => {
    expect(detectDeliverableKind("Need a technical spec for the API")).toBe(
      "spec"
    )
  })

  it("returns null for generic chat", () => {
    expect(detectDeliverableKind("How does auth work?")).toBeNull()
  })

  it("returns null for attachment-only default prompt", () => {
    expect(
      detectDeliverableKind("Review the attached file(s). Summarize the main points.")
    ).toBeNull()
  })
})

describe("classifyBlueprintIntent", () => {
  it("routes arc42 blueprint requests to update_document", () => {
    expect(
      classifyBlueprintIntent("Create an arc42 blueprint for billing", {
        hasDocument: false,
      })
    ).toBe("update_document")
  })

  it("keeps SOW requests in chat", () => {
    expect(
      classifyBlueprintIntent("Draft a SOW for ClickUp automation", {
        hasDocument: false,
      })
    ).toBe("question")
  })

  it("keeps uploaded doc questions in chat", () => {
    expect(
      classifyBlueprintIntent("Summarize the attached brief", {
        hasDocument: false,
      })
    ).toBe("question")
  })

  it("routes architecture update to update_document", () => {
    expect(
      classifyBlueprintIntent("Update the blueprint deployment section", {
        hasDocument: true,
      })
    ).toBe("update_document")
  })
})

describe("updatesDocumentPanel", () => {
  it("opens panel only for arc42 updates", () => {
    expect(updatesDocumentPanel("update_document")).toBe(true)
    expect(updatesDocumentPanel("question")).toBe(false)
  })
})
