"use client"

import * as React from "react"
import Link from "next/link"
import { FileTextIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { listContracts, type StoredContract } from "@/lib/signing/contract-store"

function statusVariant(status: StoredContract["status"]) {
  if (status === "completed") return "default" as const
  if (status === "sent") return "secondary" as const
  return "outline" as const
}

export default function ContractsPage() {
  const [contracts, setContracts] = React.useState<StoredContract[]>([])

  React.useEffect(() => {
    setContracts(listContracts())
  }, [])

  return (
    <PageContainer>
      <PageHeader
        title="Contracts"
        subtitle="Create, send, and sign statements of work."
        action={
          <Button asChild size="lg">
            <Link href="/dashboard/contracts/new">
              <PlusIcon />
              New contract
            </Link>
          </Button>
        }
      />

      {contracts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No contracts yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Create your first contract to upload a PDF, place signature fields,
            and send it for signing.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {contracts.map((contract) => (
            <Card key={contract.id} size="sm">
              <CardContent className="flex items-center gap-4">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <FileTextIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{contract.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {contract.recipients.length} signer
                    {contract.recipients.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Badge variant={statusVariant(contract.status)}>
                  {contract.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
