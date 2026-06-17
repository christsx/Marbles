const CORRECTION_HINT =
  /\b(?:not using|don't use|do not use|we don't use|we're not using|no longer using|isn't using|aren't using|that's wrong|that is wrong|not true|actually using|we use)\b/i

export function extractCorrection(message: string): string | null {
  const trimmed = message.trim()

  return CORRECTION_HINT.test(trimmed) ? trimmed : null
}

export function collectSessionCorrections(
  messages: Array<{ role: string; content: string }>
): string[] {
  const corrections: string[] = []

  for (const message of messages) {
    if (message.role !== "user") {
      continue
    }

    const correction = extractCorrection(message.content)

    if (correction) {
      corrections.push(correction)
    }
  }

  return corrections.slice(-6)
}
