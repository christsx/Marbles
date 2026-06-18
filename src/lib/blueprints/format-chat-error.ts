export function formatChatError(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === "string" && error.trim()) {
    return error
  }

  return "Could not complete that request. Check your API key and try again."
}
