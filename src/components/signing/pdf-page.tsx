"use client"

import * as React from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"

import { cn } from "@/lib/utils"

export type PdfPageSize = { width: number; height: number }

type PdfPageProps = {
  pdf: PDFDocumentProxy
  pageNumber: number
  scale?: number
  className?: string
  children?: (size: PdfPageSize) => React.ReactNode
}

export function PdfPage({
  pdf,
  pageNumber,
  scale = 1.5,
  className,
  children,
}: PdfPageProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [size, setSize] = React.useState<PdfPageSize | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    if (!canvas) return

    void (async () => {
      try {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale })
        const ctx = canvas.getContext("2d")
        if (!ctx || cancelled) return
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport } as never).promise
        if (!cancelled) setSize({ width: viewport.width, height: viewport.height })
      } catch (error) {
        console.error("PDF page render failed", error)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [pdf, pageNumber, scale])

  return (
    <div
      className={cn("relative mx-auto bg-white shadow-sm", className)}
      style={size ? { width: size.width, height: size.height } : undefined}
    >
      <canvas ref={canvasRef} className="block" />
      {size && children ? (
        <div className="absolute inset-0">{children(size)}</div>
      ) : null}
    </div>
  )
}
