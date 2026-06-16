declare module "@editorjs/checklist" {
  import type { BlockToolConstructable } from "@editorjs/editorjs"
  const Checklist: BlockToolConstructable
  export default Checklist
}

declare module "@editorjs/delimiter" {
  import type { BlockToolConstructable } from "@editorjs/editorjs"
  const Delimiter: BlockToolConstructable
  export default Delimiter
}

declare module "@editorjs/warning" {
  import type { BlockToolConstructable } from "@editorjs/editorjs"
  const Warning: BlockToolConstructable
  export default Warning
}

declare module "@editorjs/inline-code" {
  import type { InlineToolConstructable } from "@editorjs/editorjs"
  const InlineCode: InlineToolConstructable
  export default InlineCode
}
