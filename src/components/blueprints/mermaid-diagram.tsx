"use client"

import { useEffect, useRef, useState } from "react"

import { renderMermaidInto } from "@/lib/blueprints/mermaid-render"

type MermaidDiagramProps = {
  chart: string
  title?: string
  caption?: string
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(id)
  }, [value, delayMs])

  return debounced
}

export function MermaidDiagram({ chart, title, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const renderId = useRef(`mmd-${Math.random().toString(36).slice(2, 9)}`)
  const debouncedChart = useDebouncedValue(chart, 400)

  useEffect(() => {
    let cancelled = false

    async function renderDiagram() {
      if (!containerRef.current || !debouncedChart.trim()) {
        return
      }

      try {
        await renderMermaidInto(
          containerRef.current,
          debouncedChart,
          `${renderId.current}-${debouncedChart.length}`
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
  }, [debouncedChart])

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
