"use client"

type BlueprintChatStreamTailProps = {
  tail: string
}

export function BlueprintChatStreamTail({ tail }: BlueprintChatStreamTailProps) {
  if (!tail) {
    return null
  }

  const heading = tail.match(/^#{1,6}\s+(.+)$/)
  if (heading) {
    return (
      <h3 className="blueprint-chat-heading blueprint-chat-stream-tail">
        <span>{heading[1]}</span>
      </h3>
    )
  }

  const bullet = tail.match(/^[-*]\s+(.+)$/)
  if (bullet) {
    return (
      <ul className="blueprint-chat-list blueprint-chat-stream-tail">
        <li>
          <span>{bullet[1]}</span>
        </li>
      </ul>
    )
  }

  const numbered = tail.match(/^\d+[.)]\s+(.+)$/)
  if (numbered) {
    return (
      <ul className="blueprint-chat-list blueprint-chat-stream-tail">
        <li>
          <span>{numbered[1]}</span>
        </li>
      </ul>
    )
  }

  return (
    <p className="blueprint-chat-paragraph blueprint-chat-stream-tail">
      <span>{tail}</span>
    </p>
  )
}
