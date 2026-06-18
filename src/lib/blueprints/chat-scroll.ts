import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"

export function canScrollBlueprintChat(
  messages: BlueprintChatMessage[],
  isLanding: boolean
) {
  if (isLanding) {
    return false
  }

  return messages.some(
    (message) =>
      message.role === "assistant" && message.content.trim().length > 0
  )
}
