/** Strip model reasoning/thinking blocks from user-visible text. */
export function sanitizeLlmText(raw: string): string {
  const thinkOpen = "<" + "think" + ">"
  const thinkClose = "<" + "/" + "think" + ">"
  const thinkBlock = new RegExp(
    `${escapeRegExp(thinkOpen)}[\\s\\S]*?${escapeRegExp(thinkClose)}`,
    "gi"
  )
  const thinkUnclosed = new RegExp(
    `${escapeRegExp(thinkOpen)}[\\s\\S]*$`,
    "gi"
  )
  const strayThink = new RegExp(`<\\/?${"think"}>`, "gi")

  let text = raw

  for (let pass = 0; pass < 3; pass += 1) {
    let next = text
      .replace(/<think>[\s\S]*?<\/redacted_thinking>/gi, "")
      .replace(thinkBlock, "")

    if (!/<\/redacted_thinking>/i.test(next)) {
      next = next.replace(/<think>[\s\S]*$/gi, "")
    }

    if (!textIncludesTag(next, thinkClose)) {
      next = next.replace(thinkUnclosed, "")
    }

    next = next.replace(strayThink, "")

    if (next === text) {
      break
    }

    text = next
  }

  return text.replace(/\n{3,}/g, "\n\n").trim()
}

function textIncludesTag(text: string, tag: string) {
  return text.toLowerCase().includes(tag.toLowerCase())
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
