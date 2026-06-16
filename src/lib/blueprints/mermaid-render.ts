let initialized = false
let renderChain: Promise<void> = Promise.resolve()

function stripMermaidFences(source: string) {
  return source
    .replace(/^```(?:mermaid)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
}

function normalizeNewlines(source: string) {
  if (!source.includes("\n") && source.includes("\\n")) {
    return source.replace(/\\n/g, "\n")
  }

  return source
}

function quoteLabelsWithSpaces(source: string) {
  let next = source.replace(
    /([A-Za-z0-9_]+)\[([^\]\n"]+?)\]/g,
    (match, nodeId, label) => {
      if (/\s/.test(label)) {
        return `${nodeId}["${label.trim()}"]`
      }

      return match
    }
  )

  next = next.replace(/\[\(([^)"'\n]+?)\)\]/g, (match, label) => {
    if (/\s/.test(label)) {
      return `[("${label.trim()}")]`
    }

    return match
  })

  return next
}

export function prepareMermaidSource(chart: string) {
  return quoteLabelsWithSpaces(normalizeNewlines(stripMermaidFences(chart)))
}

function sanitizeRenderId(renderId: string) {
  const cleaned = renderId.replace(/[^a-zA-Z0-9_-]/g, "")

  if (!cleaned) {
    return `mmd-${Math.random().toString(36).slice(2, 11)}`
  }

  if (/^[0-9]/.test(cleaned)) {
    return `mmd-${cleaned}`
  }

  return cleaned
}

function enqueueRender<T>(task: () => Promise<T>): Promise<T> {
  const run = renderChain.then(task, task)
  renderChain = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

async function loadMermaid() {
  if (typeof window === "undefined") {
    throw new Error("Mermaid can only render in the browser.")
  }

  const mermaid = (await import("mermaid")).default

  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
    })
    initialized = true
  }

  return mermaid
}

async function renderIntoElement(
  element: HTMLElement,
  source: string,
  renderId: string
) {
  const mermaid = await loadMermaid()
  const id = sanitizeRenderId(renderId)

  element.innerHTML = ""

  const { svg, bindFunctions } = await mermaid.render(id, source, element)
  element.innerHTML = svg
  bindFunctions?.(element)
}

export async function renderMermaidInto(
  element: HTMLElement,
  chart: string,
  renderId: string
) {
  const source = prepareMermaidSource(chart)

  if (!source) {
    element.innerHTML = ""
    return
  }

  return enqueueRender(async () => {
    try {
      await renderIntoElement(element, source, renderId)
    } catch {
      const host = document.createElement("div")
      host.className = "mermaid"
      host.textContent = source
      host.removeAttribute("data-processed")
      element.innerHTML = ""
      element.append(host)

      try {
        const mermaid = await loadMermaid()
        await mermaid.run({ nodes: [host], suppressErrors: false })
      } catch {
        element.innerHTML = ""
        throw new Error("Mermaid render failed.")
      }
    }
  })
}
