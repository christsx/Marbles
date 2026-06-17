import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"

export function dropLastChatTurn(
  messages: BlueprintChatMessage[]
): BlueprintChatMessage[] {
  if (messages.length === 0) {
    return messages
  }

  const last = messages[messages.length - 1]

  if (last.role === "assistant" && messages.length >= 2) {
    const previous = messages[messages.length - 2]
    if (previous.role === "user") {
      return messages.slice(0, -2)
    }
  }

  if (last.role === "assistant") {
    return messages.slice(0, -1)
  }

  return messages.slice(0, -1)
}
