"use client"

import * as React from "react"

import { setActiveRepoAction } from "@/app/dashboard/integrations/actions"
import { Modal } from "@/components/blueprints/shared/modal"
import { GitHubProjectPicker } from "@/components/blueprints/shared/github-project-picker"
import { useGitHubProjects } from "@/components/blueprints/shared/use-github-projects"

type SelectGitHubProjectModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (fullName: string) => void
}

export function SelectGitHubProjectModal({
  open,
  onClose,
  onSelect,
}: SelectGitHubProjectModalProps) {
  const [selectedRepo, setSelectedRepo] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const { loading, connected, activeRepo, repos } = useGitHubProjects(open)

  React.useEffect(() => {
    if (!open) return
    setSelectedRepo(activeRepo)
  }, [activeRepo, open])

  async function handleContinue() {
    if (!selectedRepo) return
    setSaving(true)
    try {
      const result = await setActiveRepoAction(selectedRepo)
      if (!result.ok) return
      onSelect(selectedRepo)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      breadcrumbs={["Assistant", "Add GitHub project"]}
      primaryAction={{
        label: saving ? "Applying…" : "Use project",
        onClick: () => void handleContinue(),
        disabled: !selectedRepo || saving,
      }}
    >
      <GitHubProjectPicker
        repos={repos}
        loading={loading}
        connected={connected}
        selectedRepo={selectedRepo}
        onSelect={setSelectedRepo}
      />
    </Modal>
  )
}
