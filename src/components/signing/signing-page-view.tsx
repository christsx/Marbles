"use client"

import * as React from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"

import { PdfPage } from "@/components/signing/pdf-page"
import { SignaturePad } from "@/components/signing/signature-pad"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fieldRectPx, type SigningField } from "@/lib/signing/field-position"
import { sealSignaturesOnPdf } from "@/lib/signing/seal-pdf"

export type { SigningField } from "@/lib/signing/field-position"

type SigningPageViewProps = {
  pdfBase64: string
  fields: SigningField[]
  recipientName?: string
}

function toBytes(base64: string): Uint8Array {
  const raw = base64.includes(",") ? (base64.split(",")[1] ?? "") : base64
  const bin = atob(raw)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function SigningPageView({
  pdfBase64,
  fields,
  recipientName,
}: SigningPageViewProps) {
  const [pdf, setPdf] = React.useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = React.useState(0)
  const [activeField, setActiveField] = React.useState<string | null>(null)
  const [values, setValues] = React.useState<
    Record<string, { imageBase64: string | null; typed: string | null }>
  >({})
  const [sealing, setSealing] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
        const doc = await pdfjsLib.getDocument({ data: toBytes(pdfBase64) }).promise
        if (!cancelled) {
          setPdf(doc)
          setNumPages(doc.numPages)
        }
      } catch (error) {
        console.error("PDF load failed", error)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [pdfBase64])

  const isFilled = (id: string) =>
    Boolean(values[id]?.imageBase64 || values[id]?.typed)
  const remaining = fields.length - fields.filter((f) => isFilled(f.id)).length
  const pages = Array.from({ length: numPages }, (_, i) => i + 1)

  async function complete() {
    if (remaining > 0 || sealing) return
    setSealing(true)
    try {
      const seals = fields
        .filter((f) => isFilled(f.id))
        .map((f) => ({
          page: f.page,
          field: f.field,
          imageBase64: values[f.id]?.imageBase64 ?? null,
          typedText: values[f.id]?.typed ?? null,
        }))
      const sealed = await sealSignaturesOnPdf(toBytes(pdfBase64), seals)
      const url = URL.createObjectURL(
        new Blob([sealed as BlobPart], { type: "application/pdf" }),
      )
      const a = document.createElement("a")
      a.href = url
      a.download = "signed-contract.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setSealing(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Review and sign</h1>
          <p className="text-sm text-muted-foreground">
            {remaining > 0
              ? `${remaining} field${remaining === 1 ? "" : "s"} remaining`
              : "Ready to complete"}
          </p>
        </div>
        <Button onClick={complete} disabled={remaining > 0 || sealing} size="lg">
          {sealing ? "Sealing…" : "Complete"}
        </Button>
      </div>

      {pdf ? (
        <div className="flex flex-col gap-6">
          {pages.map((p) => (
            <PdfPage key={p} pdf={pdf} pageNumber={p}>
              {(size) =>
                fields
                  .filter((f) => f.page === p)
                  .map((f) => {
                    const r = fieldRectPx(f.field, size.width, size.height)
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveField(f.id)}
                        className={cn(
                          "absolute flex items-center justify-center rounded border-2 text-xs",
                          isFilled(f.id)
                            ? "border-emerald-500 bg-emerald-500/5 text-emerald-600"
                            : "border-primary/60 bg-primary/5 text-primary",
                        )}
                        style={{
                          left: r.x,
                          top: r.y,
                          width: r.width,
                          height: r.height,
                        }}
                      >
                        {isFilled(f.id) ? "Signed" : (f.label ?? "Sign here")}
                      </button>
                    )
                  })
              }
            </PdfPage>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Loading document…</p>
      )}

      {activeField ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setActiveField(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-background p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 font-medium">Add your signature</h2>
            <SignaturePad
              key={activeField}
              defaultName={recipientName}
              onChange={(v) =>
                setValues((s) => ({
                  ...s,
                  [activeField]: { imageBase64: v.imageBase64, typed: v.typed },
                }))
              }
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setActiveField(null)}>Apply</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
