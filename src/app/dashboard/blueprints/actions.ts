"use server"

import { redirect } from "next/navigation"
import type { OutputData } from "@editorjs/editorjs"

import { nextBlueprintId } from "@/lib/blueprints"

export type SaveBlueprintState = {
  status: "idle" | "success" | "error"
  message: string
  blueprintId?: string
}

export async function saveBlueprint(
  _prev: SaveBlueprintState,
  formData: FormData
): Promise<SaveBlueprintState> {
  const title = String(formData.get("title") ?? "").trim()
  const system = String(formData.get("system") ?? "").trim()
  const contentRaw = String(formData.get("content") ?? "")
  const blueprintId = String(formData.get("blueprintId") ?? "").trim()

  if (!title) {
    return { status: "error", message: "Title is required." }
  }
  if (!system) {
    return { status: "error", message: "System is required." }
  }

  let content: OutputData
  try {
    content = JSON.parse(contentRaw) as OutputData
    if (!content.blocks?.length) {
      return { status: "error", message: "Blueprint document cannot be empty." }
    }
  } catch {
    return { status: "error", message: "Invalid document content." }
  }

  const id = blueprintId || nextBlueprintId()

  // Mock persistence — wire to DB when ready
  void content

  redirect(`/dashboard/blueprints/${id}`)
}
