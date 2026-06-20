"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { SigningPageView } from "@/components/signing/signing-page-view"
import { PageContainer } from "@/components/page-container"
import { getContractByRecipientToken } from "@/lib/signing/contract-store"
import type { SigningField } from "@/lib/signing/field-position"
import { makeSampleContractBase64 } from "@/lib/signing/sample-contract"

const sampleFields: SigningField[] = [
  {
    id: "client",
    page: 1,
    field: { positionX: 8, positionY: 66, width: 32, height: 6 },
    label: "Client signs here",
  },
  {
    id: "marbles",
    page: 1,
    field: { positionX: 52, positionY: 66, width: 32, height: 6 },
    label: "Marbles signs here",
  },
]

export default function SignPage() {
  const params = useParams()
  const token = String(params?.token ?? "")
  const [ready, setReady] = React.useState(false)
  const [pdf, setPdf] = React.useState<string | null>(null)
  const [fields, setFields] = React.useState<SigningField[]>([])
  const [name, setName] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    const found = getContractByRecipientToken(token)
    if (found) {
      setPdf(found.contract.pdfBase64)
      setFields(found.contract.fields)
      setName(found.recipient.name)
    } else if (token === "demo") {
      void makeSampleContractBase64().then((base64) => {
        setPdf(base64)
        setFields(sampleFields)
      })
    }
    setReady(true)
  }, [token])

  if (!ready) return null

  if (!pdf) {
    return (
      <PageContainer>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Link not found
        </h1>
        <p className="text-sm text-muted-foreground">
          This signing link is invalid or has expired.
        </p>
      </PageContainer>
    )
  }

  return (
    <SigningPageView pdfBase64={pdf} fields={fields} recipientName={name} />
  )
}
