"use client"

import * as React from "react"
import { getStroke } from "perfect-freehand"

import { cn } from "@/lib/utils"

type Point = [number, number, number]

const STROKE_OPTIONS = { size: 3, thinning: 0.6, smoothing: 0.5, streamline: 0.5 }

function strokeToPath(stroke: number[][]): string {
  if (stroke.length === 0) return ""
  const d = stroke.reduce(
    (acc, point, i, arr) => {
      const next = arr[(i + 1) % arr.length] ?? point
      acc.push(point[0], point[1], (point[0] + next[0]) / 2, (point[1] + next[1]) / 2)
      return acc
    },
    ["M", stroke[0][0], stroke[0][1], "Q"] as (string | number)[]
  )
  d.push("Z")
  return d.join(" ")
}

export type SignatureDrawProps = {
  onChange?: (dataUrl: string | null) => void
  className?: string
}

export function SignatureDraw({ onChange, className }: SignatureDrawProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const strokesRef = React.useRef<Point[][]>([])
  const drawingRef = React.useRef(false)
  const [hasInk, setHasInk] = React.useState(false)

  const render = React.useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "currentColor"
    for (const points of strokesRef.current) {
      const p = new Path2D(strokeToPath(getStroke(points, STROKE_OPTIONS)))
      ctx.fill(p)
    }
  }, [])

  const resize = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    canvas.getContext("2d")?.scale(dpr, dpr)
    render()
  }, [render])

  React.useEffect(() => {
    resize()
    const onResize = () => resize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [resize])

  const exportPng = React.useCallback(() => {
    if (!canvasRef.current || strokesRef.current.length === 0) {
      onChange?.(null)
      return
    }
    onChange?.(canvasRef.current.toDataURL("image/png"))
  }, [onChange])

  const point = (e: React.PointerEvent<HTMLCanvasElement>): Point => [
    e.nativeEvent.offsetX,
    e.nativeEvent.offsetY,
    e.pressure || 0.5,
  ]

  const undo = () => {
    strokesRef.current.pop()
    setHasInk(strokesRef.current.length > 0)
    render()
    exportPng()
  }

  const clear = () => {
    strokesRef.current = []
    setHasInk(false)
    render()
    onChange?.(null)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          e.preventDefault()
          drawingRef.current = true
          strokesRef.current.push([point(e)])
          setHasInk(true)
          render()
        }}
        onPointerMove={(e) => {
          if (!drawingRef.current) return
          strokesRef.current[strokesRef.current.length - 1].push(point(e))
          render()
        }}
        onPointerUp={() => {
          drawingRef.current = false
          exportPng()
        }}
        onPointerLeave={() => {
          if (drawingRef.current) {
            drawingRef.current = false
            exportPng()
          }
        }}
        className="h-32 w-full touch-none rounded-md border bg-background text-foreground"
      />
      <div className="flex justify-end gap-4 text-sm">
        <button type="button" onClick={undo} disabled={!hasInk} className="text-muted-foreground disabled:opacity-40">
          Undo
        </button>
        <button type="button" onClick={clear} disabled={!hasInk} className="text-muted-foreground disabled:opacity-40">
          Clear
        </button>
      </div>
    </div>
  )
}
