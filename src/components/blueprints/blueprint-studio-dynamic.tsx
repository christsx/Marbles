"use client"

import dynamic from "next/dynamic"

const BlueprintStudio = dynamic(
  () =>
    import("@/components/blueprints/blueprint-studio").then((mod) => ({
      default: mod.BlueprintStudio,
    })),
  { ssr: false }
)

export { BlueprintStudio as BlueprintStudioDynamic }
