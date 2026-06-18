export type BlueprintChatHistoryTurn = {
  role: "user" | "assistant"
  content: string
}

const DEFAULT_MAX_TURNS = 6
const DEFAULT_MAX_CHARS = 12_000

type BuildChatHistoryOptions = {
  maxTurns?: number
  maxChars?: number
}

export function buildChatHistory(
  messages: Array<{ role: string; content: string; pending?: boolean }>,
  options: BuildChatHistoryOptions = {}
): BlueprintChatHistoryTurn[] {
  const maxTurns = options.maxTurns ?? DEFAULT_MAX_TURNS
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS

  const turns = messages
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        !message.pending &&
        message.content.trim().length > 0
    )
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content.trim(),
    }))

  const recent = turns.slice(-maxTurns)
  let total = 0
  const capped: BlueprintChatHistoryTurn[] = []

  for (let index = recent.length - 1; index >= 0; index -= 1) {
    const turn = recent[index]
    const nextTotal = total + turn.content.length

    if (capped.length > 0 && nextTotal > maxChars) {
      break
    }

    capped.unshift(turn)
    total = nextTotal
  }

  return capped
}

export function historyToGroqMessages(history: BlueprintChatHistoryTurn[]) {
  return history.map((turn) => ({
    role: turn.role,
    content: turn.content,
  }))
}
