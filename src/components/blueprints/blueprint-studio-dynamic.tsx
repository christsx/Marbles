"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

const BlueprintStudio = dynamic(
  () =>
    import("@/components/blueprints/blueprint-studio").then((mod) => ({
      default: mod.BlueprintStudio,
    })),
  { ssr: false }
)

export function BlueprintStudioDynamic(
  props: ComponentProps<typeof BlueprintStudio>
) {
  return <BlueprintStudio {...props} />
}
