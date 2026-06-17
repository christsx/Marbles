import type { OutputData } from "@editorjs/editorjs"

import { generateAgenticBlueprint } from "@/lib/blueprint-editor"

export type BlueprintStatus = "Draft" | "In review" | "Approved" | "Implemented"

export type BlueprintRisk = "Low" | "Medium" | "High"

export type Blueprint = {
  id: string
  title: string
  system: string
  status: BlueprintStatus
  risk: BlueprintRisk
  components: number
  author: string
  updated: string
  content: OutputData
}

export const blueprints: Blueprint[] = [
  {
    id: "BP-204",
    title: "Multi-tenant data isolation",
    system: "core-api",
    status: "Approved",
    risk: "High",
    components: 9,
    author: "Atlas",
    updated: "1 day ago",
    content: generateAgenticBlueprint({
      title: "Multi-tenant data isolation",
      system: "core-api",
    }),
  },
  {
    id: "BP-201",
    title: "Event bus + work-order queue",
    system: "platform",
    status: "Implemented",
    risk: "Medium",
    components: 7,
    author: "Orion",
    updated: "3 days ago",
    content: generateAgenticBlueprint({
      title: "Event bus + work-order queue",
      system: "platform",
    }),
  },
  {
    id: "BP-198",
    title: "Usage metering & billing",
    system: "billing-svc",
    status: "In review",
    risk: "High",
    components: 6,
    author: "Atlas",
    updated: "2 days ago",
    content: generateAgenticBlueprint({
      title: "Usage metering & billing",
      system: "billing-svc",
    }),
  },
  {
    id: "BP-195",
    title: "Realtime dashboard transport",
    system: "web-app",
    status: "Approved",
    risk: "Medium",
    components: 4,
    author: "Nova",
    updated: "4 days ago",
    content: generateAgenticBlueprint({
      title: "Realtime dashboard transport",
      system: "web-app",
    }),
  },
  {
    id: "BP-190",
    title: "Secrets rotation strategy",
    system: "infra",
    status: "Draft",
    risk: "High",
    components: 5,
    author: "Echo",
    updated: "6 days ago",
    content: generateAgenticBlueprint({
      title: "Secrets rotation strategy",
      system: "infra",
    }),
  },
  {
    id: "BP-186",
    title: "Public API versioning",
    system: "core-api",
    status: "Implemented",
    risk: "Low",
    components: 3,
    author: "Orion",
    updated: "1 week ago",
    content: generateAgenticBlueprint({
      title: "Public API versioning",
      system: "core-api",
    }),
  },
]

export function getBlueprint(id: string): Blueprint | undefined {
  return blueprints.find((bp) => bp.id === id)
}

export function nextBlueprintId(): string {
  const nums = blueprints
    .map((bp) => Number(bp.id.replace("BP-", "")))
    .filter((n) => !Number.isNaN(n))
  const next = (nums.length ? Math.max(...nums) : 200) + 1
  return `BP-${next}`
}

export const BLUEPRINT_GENERAL_SYSTEM = "general"

export const blueprintSystems = [
  "core-api",
  "platform",
  "web-app",
  "billing-svc",
  "infra",
] as const

export type BlueprintSystem = (typeof blueprintSystems)[number]

export const blueprintSystemOptions: {
  id: BlueprintSystem
  label: string
  description: string
}[] = [
  {
    id: "core-api",
    label: "Core API",
    description: "APIs & services",
  },
  {
    id: "platform",
    label: "Platform",
    description: "Shared services",
  },
  {
    id: "web-app",
    label: "Web app",
    description: "Frontend & UX",
  },
  {
    id: "billing-svc",
    label: "Billing",
    description: "Payments & plans",
  },
  {
    id: "infra",
    label: "Infrastructure",
    description: "Cloud & deploy",
  },
]

export function getBlueprintSystemOption(id: string) {
  if (id === BLUEPRINT_GENERAL_SYSTEM) {
    return {
      id: BLUEPRINT_GENERAL_SYSTEM,
      label: "General",
      description: "No repo attached",
    }
  }

  return (
    blueprintSystemOptions.find((option) => option.id === id) ??
    blueprintSystemOptions[0]
  )
}
