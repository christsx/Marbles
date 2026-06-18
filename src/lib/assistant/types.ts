export type Workflow = {
  id: string
  title: string
  description?: string
}

export type AssistantProject = {
  id: string
  name: string
  cmNumber?: string | null
}

export type WorkflowType = "assistant"
