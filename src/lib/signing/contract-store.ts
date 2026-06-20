import type { SigningField } from "@/lib/signing/field-position"

export type StoredRecipient = {
  id: string
  name: string
  email: string
  token: string
  signed: boolean
}

export type StoredContract = {
  id: string
  title: string
  pdfBase64: string
  fields: SigningField[]
  recipients: StoredRecipient[]
  createdAt: number
  status: "draft" | "sent" | "completed"
}

const KEY = "marbles:contracts"

function read(): StoredContract[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredContract[]) : []
  } catch {
    return []
  }
}

function write(contracts: StoredContract[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEY, JSON.stringify(contracts))
}

export function listContracts(): StoredContract[] {
  return read().sort((a, b) => b.createdAt - a.createdAt)
}

export function saveContract(contract: StoredContract) {
  const all = read().filter((c) => c.id !== contract.id)
  all.push(contract)
  write(all)
}

export function getContractByRecipientToken(
  token: string,
): { contract: StoredContract; recipient: StoredRecipient } | null {
  for (const contract of read()) {
    const recipient = contract.recipients.find((r) => r.token === token)
    if (recipient) return { contract, recipient }
  }
  return null
}

export function newToken(): string {
  const uuid =
    globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
  return uuid.replace(/-/g, "").slice(0, 20)
}
