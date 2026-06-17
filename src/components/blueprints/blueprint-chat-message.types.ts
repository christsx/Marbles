export type BlueprintChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  pending?: boolean
  streaming?: boolean
  startedAt?: number
  thoughtSeconds?: number
  userPrompt?: string
}
