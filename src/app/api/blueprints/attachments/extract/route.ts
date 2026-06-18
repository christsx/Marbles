import { auth } from "@clerk/nextjs/server"

import { extractAttachmentText } from "@/lib/blueprints/extract-attachment-text"
import { formatAttachmentContextBlock } from "@/lib/blueprints/format-attachment-context"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ message: "Unauthorized." }, { status: 401 })
  }

  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return Response.json({ message: "Invalid form data." }, { status: 400 })
  }

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File)

  if (!files.length) {
    return Response.json({ context: null })
  }

  try {
    const parts = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const extracted = await extractAttachmentText(
          buffer,
          file.name,
          file.type
        )

        return {
          label: file.name,
          text: extracted.text,
          note: extracted.note,
        }
      })
    )

    return Response.json({ context: formatAttachmentContextBlock(parts) })
  } catch (error) {
    console.error("Attachment extract failed:", error)

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Could not read attached files.",
      },
      { status: 500 }
    )
  }
}
