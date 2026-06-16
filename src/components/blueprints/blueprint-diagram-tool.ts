import { renderMermaidInto } from "@/lib/blueprints/mermaid-render"

type DiagramData = {
  title?: string
  caption?: string
  variant?: string
  chart: string
}

type DiagramToolConfig = {
  data?: DiagramData
  readOnly?: boolean
}

export default class BlueprintDiagramTool {
  private data: DiagramData
  private readOnly: boolean
  private chartSource: string
  private wrapper: HTMLDivElement | null = null
  private preview: HTMLDivElement | null = null
  private previewTimer: ReturnType<typeof setTimeout> | null = null
  private renderId = `diagram-${Math.random().toString(36).slice(2, 9)}`

  static get toolbox() {
    return {
      title: "Diagram",
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="5" y="9" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M4 7v1.5M12 7v1.5M8 7v2" stroke="currentColor" stroke-width="1.5"/></svg>`,
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  constructor({ data, readOnly }: DiagramToolConfig) {
    this.data = {
      title: data?.title ?? "",
      caption: data?.caption ?? "",
      variant: data?.variant ?? "flowchart",
      chart:
        data?.chart ??
        "flowchart TB\n  Client[Client] --> API[Forge API]\n  API --> DB[(Database)]",
    }
    this.chartSource = this.data.chart ?? ""
    this.readOnly = Boolean(readOnly)
  }

  private schedulePreview() {
    if (!this.preview) {
      return
    }

    if (this.previewTimer) {
      clearTimeout(this.previewTimer)
    }

    this.previewTimer = setTimeout(() => {
      void renderMermaidInto(
        this.preview!,
        this.chartSource,
        `${this.renderId}-${Date.now()}`
      ).catch(() => {
        if (this.preview) {
          this.preview.innerHTML =
            `<p class="blueprint-diagram-tool__error">Diagram preview unavailable.</p>`
        }
      })
    }, 200)
  }

  render() {
    this.wrapper = document.createElement("div")
    this.wrapper.className = "blueprint-diagram-tool"

    this.preview = document.createElement("div")
    this.preview.className = "blueprint-diagram-tool__preview"
    this.preview.setAttribute("aria-label", "Architecture diagram")

    this.wrapper.append(this.preview)

    requestAnimationFrame(() => {
      this.schedulePreview()
    })

    return this.wrapper
  }

  save() {
    return {
      title: this.data.title ?? "",
      caption: this.data.caption ?? "",
      variant: this.data.variant ?? "flowchart",
      chart: this.chartSource.trim(),
    }
  }
}
