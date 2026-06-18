import { notFound } from "next/navigation"

import { BlueprintStudioDynamic } from "@/components/blueprints/blueprint-studio-dynamic"
import { blueprints, getBlueprint } from "@/lib/blueprints"

export function generateStaticParams() {
  return blueprints.map((bp) => ({ id: bp.id }))
}

export default async function EditBlueprintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blueprint = getBlueprint(id)

  if (!blueprint) {
    notFound()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <BlueprintStudioDynamic
        blueprintId={blueprint.id}
        defaultTitle={blueprint.title}
        defaultSystem={blueprint.system}
        initialContent={blueprint.content}
      />
    </div>
  )
}
