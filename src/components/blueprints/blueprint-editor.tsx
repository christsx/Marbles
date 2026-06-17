"use client"

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import type EditorJS from "@editorjs/editorjs"
import type { OutputData } from "@editorjs/editorjs"

import "./blueprint-editor.css"
import { polishBlueprintBlocks } from "@/lib/blueprints/editorjs-from-llm"
import { cn } from "@/lib/utils"

export type BlueprintEditorHandle = {
  save: () => Promise<OutputData>
  render: (data: OutputData) => Promise<void>
  isReady: boolean
}

type BlueprintEditorProps = {
  initialData?: OutputData
  readOnly?: boolean
  className?: string
  minHeight?: number
}

function polishContent(data?: OutputData): OutputData | undefined {
  if (!data?.blocks?.length) {
    return data
  }

  return {
    ...data,
    blocks: polishBlueprintBlocks(data.blocks),
  }
}

export const BlueprintEditor = forwardRef<
  BlueprintEditorHandle,
  BlueprintEditorProps
>(function BlueprintEditor(
  { initialData, readOnly = false, className, minHeight = 360 },
  ref
) {
  const holderId = useId().replace(/:/g, "")
  const holderRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorJS | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let destroyed = false

    async function init() {
      const [
        { default: Editor },
        { default: Header },
        { default: List },
        { default: Quote },
        { default: Checklist },
        { default: InlineCode },
        { default: Delimiter },
        { default: Warning },
        { default: DiagramTool },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/quote"),
        import("@editorjs/checklist"),
        import("@editorjs/inline-code"),
        import("@editorjs/delimiter"),
        import("@editorjs/warning"),
        import("@/components/blueprints/blueprint-diagram-tool"),
      ])

      if (destroyed || !holderRef.current) return

      const editor = new Editor({
        holder: holderRef.current,
        readOnly,
        data: polishContent(initialData),
        placeholder:
          "Write your blueprint — goals, architecture, contracts, rollout plan…",
        minHeight,
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["link"],
            config: { levels: [1, 2, 3], defaultLevel: 2 },
          },
          list: { class: List, inlineToolbar: true },
          checklist: { class: Checklist, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
          diagram: DiagramTool,
          inlineCode: InlineCode,
          delimiter: Delimiter,
          warning: Warning,
        },
      })

      await editor.isReady
      if (destroyed) {
        editor.destroy()
        return
      }

      editorRef.current = editor
      setReady(true)
    }

    init()

    return () => {
      destroyed = true
      setReady(false)
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
      if (holderRef.current) {
        holderRef.current.innerHTML = ""
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once per mount
  }, [readOnly])

  useImperativeHandle(ref, () => ({
    isReady: ready,
    save: async () => {
      if (!editorRef.current) {
        throw new Error("Editor not ready")
      }
      return editorRef.current.save()
    },
    render: async (data: OutputData) => {
      if (!editorRef.current) {
        throw new Error("Editor not ready")
      }
      const polished = polishContent(data)

      if (!polished) {
        throw new Error("Blueprint content is empty")
      }

      await editorRef.current.render(polished)
    },
  }))

  return (
    <div
      className={cn("blueprint-editor rounded-xl border border-border bg-card", className)}
      style={{ minHeight }}
    >
      <div ref={holderRef} id={holderId} />
    </div>
  )
})
