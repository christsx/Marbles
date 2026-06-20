"use client"

import { PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  newToken,
  type StoredRecipient,
} from "@/lib/signing/contract-store"

type ContractRecipientsProps = {
  recipients: StoredRecipient[]
  onChange: (recipients: StoredRecipient[]) => void
}

export function ContractRecipients({
  recipients,
  onChange,
}: ContractRecipientsProps) {
  const add = () => {
    onChange([
      ...recipients,
      { id: newToken(), name: "", email: "", token: newToken(), signed: false },
    ])
  }

  const update = (id: string, patch: Partial<StoredRecipient>) =>
    onChange(
      recipients.map((recipient) =>
        recipient.id === id ? { ...recipient, ...patch } : recipient,
      ),
    )

  const remove = (id: string) =>
    onChange(recipients.filter((recipient) => recipient.id !== id))

  return (
    <div className="flex flex-col gap-2">
      {recipients.map((recipient) => (
        <div key={recipient.id} className="flex gap-2">
          <Input
            placeholder="Name"
            value={recipient.name}
            onChange={(event) => update(recipient.id, { name: event.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={recipient.email}
            onChange={(event) =>
              update(recipient.id, { email: event.target.value })
            }
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => remove(recipient.id)}
            aria-label="Remove signer"
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={add}
        className="self-start"
      >
        <PlusIcon />
        Add signer
      </Button>
    </div>
  )
}
