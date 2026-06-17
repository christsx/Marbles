export type BlueprintMessageIntent = "question" | "update_document"

export type BlueprintDeliverableKind = "sow" | "prd" | "spec" | null

type ClassifyOptions = {
  hasDocument: boolean
}

export function classifyBlueprintIntent(
  message: string,
  options: ClassifyOptions
): BlueprintMessageIntent {
  const text = message.trim()

  if (!text) {
    return options.hasDocument ? "question" : "question"
  }

  if (isProseDeliverableRequest(text)) {
    return "question"
  }

  if (isArc42BlueprintRequest(text)) {
    return "update_document"
  }

  if (isQuestion(text)) {
    return "question"
  }

  if (options.hasDocument) {
    return "question"
  }

  return "question"
}

export function detectDeliverableKind(message: string): BlueprintDeliverableKind {
  const lower = message.toLowerCase()

  if (/\b(scope of work|statement of work|\bsow\b)\b/.test(lower)) {
    return "sow"
  }

  if (/\bneed\b.*\bscope\b/.test(lower)) {
    return "sow"
  }

  if (
    /\b(client|customer|stakeholder)\b/.test(lower) &&
    /\b(doc|document|scope|scoping|proposal|brief)\b/.test(lower)
  ) {
    return "sow"
  }

  if (/\bscoping\b.*\b(automation|project|work|build)\b/.test(lower)) {
    return "sow"
  }

  if (/\b(product requirements|\bprd\b)\b/.test(lower)) {
    return "prd"
  }

  if (/\b(technical spec|specification|\bspec\b)\b/.test(lower)) {
    return "spec"
  }

  return null
}

function isProseDeliverableRequest(text: string) {
  const lower = text.toLowerCase()

  return [
    /\b(scope of work|statement of work|\bsow\b)\b/,
    /\bneed\b.*\bscope\b/,
    /\b(product requirements|\bprd\b)\b/,
    /\b(doc|document)\b.*\b(client|customer|stakeholder)\b/,
    /\b(client|customer)\b.*\b(doc|document|scope|proposal)\b/,
    /\b(write|draft|prepare|create|need)\b.*\b(memo|brief|summary|report|document|email|doc)\b/,
    /\b(send|share)\b.*\b(to my team|the team|stakeholders|team)\b/,
    /\bfor my team\b/,
  ].some((pattern) => pattern.test(lower))
}

function isQuestion(text: string) {
  const lower = text.toLowerCase()

  if (lower.endsWith("?")) {
    return true
  }

  return [
    /^(what|why|how|when|where|who|which|whose)\b/,
    /^(is|are|was|were|do|does|did|can|could|should|would|will|have|has|had)\s+/,
    /^(tell me|explain|describe|clarify|help me understand|walk me through)\b/,
    /\b(what is|what are|how does|how do|why is|why are|can you explain)\b/,
  ].some((pattern) => pattern.test(lower))
}

function isArc42BlueprintRequest(text: string) {
  const lower = text.toLowerCase()

  if (isProseDeliverableRequest(text)) {
    return false
  }

  return [
    /\b(blueprint|arc42)\b/,
    /\bsystem design\b/,
    /\b(architect|architecture)\b.*\b(for|of|about)\b/,
    /\b(generate|create|draft|write|produce|build)\b.*\b(blueprint|arc42)\b/,
    /\b(update|revise|regenerate|rewrite|modify|redraft)\b.*\b(blueprint|arc42|section|diagram)\b/,
    /\b(add|include|expand|flesh out|elaborate)\b.*\b(section|diagram|blueprint|deployment|runtime)\b/,
    /\b(more detail|more detailed|go deeper|deeper dive|expand on)\b/,
  ].some((pattern) => pattern.test(lower))
}

export function getIntentAssistantHint(
  intent: BlueprintMessageIntent,
  deliverable?: BlueprintDeliverableKind,
  wantsDiagram = false
) {
  if (intent === "question") {
    if (wantsDiagram) {
      return "Drafting architecture diagram…"
    }

    if (deliverable === "sow") {
      return "Drafting scope of work from repository context…"
    }

    if (deliverable === "prd") {
      return "Drafting product requirements from repository context…"
    }

    if (deliverable === "spec") {
      return "Drafting spec from repository context…"
    }

    return "Researching repository context…"
  }

  return "Generating blueprint from repository context…"
}

export function getIntentSuccessMessage(
  intent: BlueprintMessageIntent,
  hasDocument: boolean
) {
  if (intent === "question") {
    return ""
  }

  return hasDocument
    ? "Blueprint updated. View diagrams in the panel on the right."
    : "Blueprint draft ready. View diagrams in the panel on the right."
}

/** Doc panel opens only for arc42 blueprint generation — not for chat or prose deliverables. */
export function updatesDocumentPanel(intent: BlueprintMessageIntent) {
  return intent === "update_document"
}
