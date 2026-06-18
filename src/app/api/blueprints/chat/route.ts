import { auth } from "@clerk/nextjs/server"

import { streamText } from "@/lib/ai/stream-text"
import { isBlueprintGenerationConfigured } from "@/lib/ai/config"
import { buildBlueprintChatRequest } from "@/lib/blueprints/build-chat-request"
import type { BlueprintChatHistoryTurn } from "@/lib/blueprints/chat-history"
import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ message: "Unauthorized." }, { status: 401 })
  }

  if (!isBlueprintGenerationConfigured()) {
    return Response.json(
      {
        message:
          "Blueprint assistant is not configured. Add GROQ_API_KEY to .env.local.",
      },
      { status: 503 }
    )
  }

  let body: {
    question?: string
    system?: string
    title?: string
    hasDocument?: boolean
    deliverable?: BlueprintDeliverableKind
    corrections?: string[]
    includeRepoContext?: boolean
    attachmentContext?: string | null
    modelId?: string | null
    history?: BlueprintChatHistoryTurn[]
    userFirstName?: string
    isFirstTurn?: boolean
    workflowId?: string | null
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 })
  }

  const question = body.question?.trim() ?? ""
  const system = body.system?.trim() ?? ""

  if (!question) {
    return Response.json({ message: "Question is required." }, { status: 400 })
  }

  if (!system) {
    return Response.json({ message: "System is required." }, { status: 400 })
  }

  try {
    const chatRequest = await buildBlueprintChatRequest({
      question,
      system,
      title: body.title?.trim(),
      hasDocument: Boolean(body.hasDocument),
      deliverable: body.deliverable ?? null,
      corrections: body.corrections,
      includeRepoContext: body.includeRepoContext === true,
      attachmentContext: body.attachmentContext ?? null,
      history: body.history ?? [],
      userFirstName: body.userFirstName?.trim(),
      isFirstTurn: Boolean(body.isFirstTurn),
      workflowId: body.workflowId?.trim() || null,
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamText({
            system: chatRequest.system,
            prompt: chatRequest.prompt,
            maxTokens: chatRequest.maxTokens,
            modelId: body.modelId,
            history: chatRequest.history,
          })) {
            if (request.signal.aborted) {
              controller.close()
              return
            }

            controller.enqueue(encoder.encode(chunk))
          }

          controller.close()
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not complete the assistant stream."

          controller.enqueue(encoder.encode(`\n[STREAM_ERROR] ${message}`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  } catch (error) {
    console.error("Blueprint chat stream failed:", error)

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Could not start blueprint chat stream.",
      },
      { status: 500 }
    )
  }
}
