"use server"

import { redirect } from "next/navigation"
import type { OutputData } from "@editorjs/editorjs"

import { isBlueprintGenerationConfigured } from "@/lib/ai/config"
import { answerBlueprintQuestion } from "@/lib/blueprints/answer"
import { generateBlueprintWithLlm } from "@/lib/blueprints/generate"
import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import { nextBlueprintId } from "@/lib/blueprints"

export type SaveBlueprintState = {
  status: "idle" | "success" | "error"
  message: string
  blueprintId?: string
}

export type GenerateBlueprintState =
  | { status: "idle" }
  | { status: "success"; content: OutputData }
  | { status: "error"; message: string }

export type AnswerBlueprintQuestionState =
  | { status: "idle" }
  | { status: "success"; answer: string }
  | { status: "error"; message: string }

export async function generateBlueprintAction(input: {
  title: string
  system: string
  prompt?: string
  modelId?: string | null
}): Promise<GenerateBlueprintState> {
  const title = input.title.trim()
  const system = input.system.trim()
  const prompt = input.prompt?.trim()

  if (!title) {
    return { status: "error", message: "Title is required." }
  }

  if (!system) {
    return { status: "error", message: "System is required." }
  }

  if (!isBlueprintGenerationConfigured()) {
    return {
      status: "error",
      message:
        "Blueprint generation is not configured. Add GROQ_API_KEY to .env.local.",
    }
  }

  try {
    const content = await generateBlueprintWithLlm({
      title,
      system,
      prompt,
      modelId: input.modelId,
    })
    return { status: "success", content }
  } catch (error) {
    console.error("Blueprint generation failed:", error)

    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not generate blueprint draft.",
    }
  }
}

export async function answerBlueprintQuestionAction(input: {
  question: string
  system: string
  title?: string
  hasDocument: boolean
  deliverable?: BlueprintDeliverableKind
  corrections?: string[]
  includeRepoContext?: boolean
  attachmentContext?: string | null
  modelId?: string | null
}): Promise<AnswerBlueprintQuestionState> {
  const question = input.question.trim()
  const system = input.system.trim()

  if (!question) {
    return { status: "error", message: "Question is required." }
  }

  if (!system) {
    return { status: "error", message: "System is required." }
  }

  if (!isBlueprintGenerationConfigured()) {
    return {
      status: "error",
      message:
        "Blueprint assistant is not configured. Add GROQ_API_KEY to .env.local.",
    }
  }

  try {
    const answer = await answerBlueprintQuestion({
      question,
      system,
      title: input.title?.trim(),
      hasDocument: input.hasDocument,
      deliverable: input.deliverable,
      corrections: input.corrections,
      includeRepoContext: input.includeRepoContext,
      attachmentContext: input.attachmentContext,
      modelId: input.modelId,
    })

    return { status: "success", answer }
  } catch (error) {
    console.error("Blueprint research failed:", error)

    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not research that question.",
    }
  }
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
