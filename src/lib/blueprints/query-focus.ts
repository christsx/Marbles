export type QueryFocus = {
  infra: boolean
  clientDeliverable: boolean
  systemAmbiguous: boolean
  wantsCodebaseOverview: boolean
  wantsExplicitDiagram: boolean
  wantsDiagram: boolean
}

export function detectQueryFocus(question: string): QueryFocus {
  const lower = question.toLowerCase()

  const wantsCodebaseOverview =
    /\b(don't|do not|dont)\s+(really\s+)?(get|understand|know)\b/.test(lower) ||
    /\b(built this|built with|my repo|my codebase|my app|this repo|this app|this project)\b/.test(
      lower
    ) ||
    /\b(what is this|what's this|what does this|explain what|help me understand|walk me through)\b/.test(
      lower
    ) ||
    /\bwhat does (it|this|the app|my app) do\b/.test(lower) ||
    /\bhow does (it|this|the app|my app) work\b/.test(lower) ||
    /\bexplain (the|my|this) (app|project|codebase|repo)\b/.test(lower)

  const wantsExplicitDiagram =
    /\b(diagram|diagrams|graph|graphs|visuali[sz]e|mermaid)\b/.test(lower) ||
    /\b(context|container|sequence|deployment|runtime|c4)\b.*\bdiagram\b/.test(
      lower
    ) ||
    /\b(draw|sketch|map out|show me)\b.*\b(architecture|system|infra|deployment|context)\b/.test(
      lower
    ) ||
    /\b(architecture|system design)\b.*\b(visual|diagram|graph|picture)\b/.test(
      lower
    )

  const wantsDiagram = wantsCodebaseOverview || wantsExplicitDiagram

  return {
    infra: /\b(infra|infrastructure|deploy|deployment|hosting|ci\/cd|pipeline|cloud|terraform|docker|vercel|fly\.io|railway)\b/.test(
      lower
    ),
    clientDeliverable:
      /\b(client|customer|stakeholder)\b/.test(lower) &&
      /\b(doc|document|scope|scoping|proposal|sow|brief)\b/.test(lower),
    systemAmbiguous:
      !wantsCodebaseOverview &&
      /\b(core[- ]?api|platform)\b/.test(lower) &&
      /\b(not sure|which|or\b|either|help me pick|should it be)\b/.test(lower),
    wantsCodebaseOverview,
    wantsExplicitDiagram,
    wantsDiagram,
  }
}
