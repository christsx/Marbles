"use client"

import * as React from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { PenLineIcon, SendIcon } from "lucide-react"

import { ContractRecipients } from "@/components/signing/contract-recipients"
import { PdfPage } from "@/components/signing/pdf-page"
import {
  SigningPageView,
  type SigningField,
} from "@/components/signing/signing-page-view"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { fieldRectPx } from "@/lib/signing/field-position"
import {
  newToken,
  saveContract,
  type StoredRecipient,
} from "@/lib/signing/contract-store"

function toBytes(dataUrl: string): Uint8Array {
  const raw = dataUrl.includes(",") ? (dataUrl.split(",")[1] ?? "") : dataUrl
  const bin = atob(raw)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function ContractEditor() {
  const [pdfBase64, setPdfBase64] = React.useState<string | null>(null)
  const [pdfDoc, setPdfDoc] = React.useState<PDFDocumentProxy | null>(null)
  const [title, setTitle] = React.useState("")
  const [recipients, setRecipients] = React.useState<StoredRecipient[]>([])
  const [fields, setFields] = React.useState<SigningField[]>([])
  const [signing, setSigning] = React.useState(false)
  const [sentLinks, setSentLinks] = React.useState<
    { name: string; url: string }[]
  >([])

  React.useEffect(() => {
    if (!pdfBase64) {
      setPdfDoc(null)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
        const doc = await pdfjsLib.getDocument({ data: toBytes(pdfBase64) }).promise
        if (!cancelled) setPdfDoc(doc)
      } catch (error) {
        console.error("PDF load failed", error)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [pdfBase64])

  function onUpload(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setPdfBase64(reader.result as string)
      setFields([])
      if (!title) setTitle(file.name.replace(/\.pdf$/i, ""))
    }
    reader.readAsDataURL(file)
  }

  function placeField(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const positionX = Math.max(0, ((event.clientX - rect.left) / rect.width) * 100 - 10)
    const positionY = Math.max(0, ((event.clientY - rect.top) / rect.height) * 100 - 3)
    setFields((current) => [
      ...current,
      {
        id: `field-${current.length + 1}`,
        page: 1,
        field: { positionX, positionY, width: 20, height: 6 },
        label: "Sign here",
      },
    ])
  }

  function send() {
    if (!pdfBase64 || recipients.length === 0) return
    const id = newToken()
    saveContract({
      id,
      title: title.trim() || "Untitled contract",
      pdfBase64,
      fields,
      recipients,
      createdAt: Date.now(),
      status: "sent",
    })
    const origin = window.location.origin
    setSentLinks(
      recipients
        .filter((r) => r.email.trim() || r.name.trim())
        .map((r) => ({ name: r.name || r.email, url: `${origin}/sign/${r.token}` })),
    )
  }

  if (signing && pdfBase64) {
    return (
      <SigningPageView
        pdfBase64={pdfBase64}
        fields={fields}
        recipientName={recipients[0]?.name}
      />
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="New contract"
        subtitle="Upload a PDF, add signers, place fields, then send."
      />

      {sentLinks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Sent for signature</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p className="text-muted-foreground">
              Share these links (local demo — delivery needs the live database):
            </p>
            {sentLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className="truncate rounded-md border px-3 py-2 font-mono text-xs hover:bg-muted"
              >
                {link.name || "Signer"}: {link.url}
              </a>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {!pdfBase64 ? (
        <Card>
          <CardContent>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed py-12 text-center text-sm text-muted-foreground hover:bg-muted/40">
              <span className="font-medium text-foreground">Upload a PDF</span>
              <span>Click to choose a file</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) onUpload(file)
                }}
              />
            </label>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Input
                placeholder="Contract title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Signers</CardTitle>
            </CardHeader>
            <CardContent>
              <ContractRecipients recipients={recipients} onChange={setRecipients} />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Signature fields</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                {fields.length === 0
                  ? "Click on the document to place a signature field."
                  : `${fields.length} field${fields.length === 1 ? "" : "s"} placed.`}
              </p>
              {pdfDoc ? (
                <PdfPage pdf={pdfDoc} pageNumber={1}>
                  {(size) => (
                    <div
                      className="absolute inset-0 cursor-crosshair"
                      onClick={placeField}
                    >
                      {fields.map((field) => {
                        const rect = fieldRectPx(field.field, size.width, size.height)
                        return (
                          <div
                            key={field.id}
                            className="absolute flex items-center justify-center rounded border-2 border-primary bg-primary/10 text-primary"
                            style={{
                              left: rect.x,
                              top: rect.y,
                              width: rect.width,
                              height: rect.height,
                            }}
                          >
                            <PenLineIcon className="size-3" />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </PdfPage>
              ) : (
                <p className="text-sm text-muted-foreground">Loading preview…</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSigning(true)}
              disabled={fields.length === 0}
            >
              Sign now
            </Button>
            <Button
              onClick={send}
              disabled={fields.length === 0 || recipients.length === 0}
            >
              <SendIcon />
              Send for signature
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
