"use client"

import * as React from "react"

import { SignatureDraw } from "@/components/signing/signature-draw"
import { cn } from "@/lib/utils"

export type SignatureValue = {
  typed: string | null
  imageBase64: string | null
}

export type SignaturePadProps = {
  onChange?: (value: SignatureValue) => void
  defaultName?: string
  className?: string
}

export function SignaturePad({
  onChange,
  defaultName,
  className,
}: SignaturePadProps) {
  const [mode, setMode] = React.useState<"draw" | "type">("draw")
  const [typed, setTyped] = React.useState(defaultName ?? "")
  const [image, setImage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (mode === "draw") {
      onChange?.({ typed: null, imageBase64: image })
    } else {
      onChange?.({ typed: typed.trim() || null, imageBase64: null })
    }
  }, [mode, typed, image, onChange])

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex gap-1 self-start rounded-md border bg-muted/40 p-0.5 text-sm">
        {(["draw", "type"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded px-3 py-1 capitalize",
              mode === m
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "draw" ? (
        <SignatureDraw onChange={setImage} />
      ) : (
        <div className="flex flex-col gap-3">
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type your full legal name"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
          />
          <div className="flex h-32 items-center justify-center overflow-hidden rounded-md border">
            <span
              style={{
                fontFamily: "'Caveat', 'Segoe Script', 'Brush Script MT', cursive",
              }}
              className="text-5xl"
            >
              {typed.trim() || (
                <span className="text-base text-muted-foreground">
                  Preview
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
