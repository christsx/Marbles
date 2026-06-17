export type QueryFocus = {
  infra: boolean
  clientDeliverable: boolean
  systemAmbiguous: boolean
  wantsDiagram: boolean
}

export function detectQueryFocus(question: string): QueryFocus {
  const lower = question.toLowerCase()

  return {
    infra: /\b(infra|infrastructure|deploy|deployment|hosting|ci\/cd|pipeline|cloud|terraform|docker|vercel|fly\.io|railway)\b/.test(
      lower
    ),
    clientDeliverable:
      /\b(client|customer|stakeholder)\b/.test(lower) &&
      /\b(doc|document|scope|scoping|proposal|sow|brief)\b/.test(lower),
    systemAmbiguous:
      /\b(core[- ]?api|platform)\b/.test(lower) &&
      /\b(not sure|which|or\b|either|help me pick|should it be)\b/.test(lower),
    wantsDiagram:
      /\b(diagram|diagrams|graph|graphs|visuali[sz]e|mermaid)\b/.test(lower) ||
      /\b(context|container|sequence|deployment|runtime|c4)\b.*\bdiagram\b/.test(
        lower
      ) ||
      /\b(draw|sketch|map out|show me)\b.*\b(architecture|system|infra|deployment|context)\b/.test(
        lower
      ) ||
      /\b(architecture|system design)\b.*\b(visual|diagram|graph|picture)\b/.test(
        lower
      ),
  }
}
