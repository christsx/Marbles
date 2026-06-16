"use client"

import { useEffect, useRef, useState } from "react"

import { renderMermaidInto } from "@/lib/blueprints/mermaid-render"

type MermaidDiagramProps = {
  chart: string
  title?: string
  caption?: string
}

export function MermaidDiagram({ chart, title, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const renderId = useRef(`mmd-${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    let cancelled = false

    async function renderDiagram() {
      if (!containerRef.current) {
        return
      }

      try {
        await renderMermaidInto(
          containerRef.current,
          chart,
          `${renderId.current}-${Date.now()}`
        )

        if (!cancelled) {
          setError(null)
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Could not render diagram."
          )
        }
      }
    }

    void renderDiagram()

    return () => {
      cancelled = true
    }
  }, [chart])

  return (
    <figure className="flex flex-col gap-2">
      {title ? (
        <figcaption className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </figcaption>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-border bg-muted/20 p-4">
        {error ? (
          <p className="text-sm text-muted-foreground">
            Diagram could not be rendered.
          </p>
        ) : (
          <div
            ref={containerRef}
            className="flex min-h-[120px] items-center justify-center [&_svg]:mx-auto [&_svg]:max-w-full"
          />
        )}
      </div>
      {caption ? (
        <p className="text-xs text-muted-foreground">{caption}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </figure>
  )
}
