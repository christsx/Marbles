export type PlaybookSection = {
  heading: string
  body: string
}

export type Playbook = {
  slug: string
  title: string
  category: string
  owner: string
  updated: string
  summary: string
  sections: PlaybookSection[]
}

export const playbooks: Playbook[] = [
  {
    slug: "requirement-to-spec",
    title: "Requirement to Spec",
    category: "Planning",
    owner: "Atlas",
    updated: "2 days ago",
    summary:
      "How an intake requirement becomes a buildable, testable specification.",
    sections: [
      { heading: "Goal", body: "Turn every accepted requirement into an unambiguous spec with acceptance criteria." },
      { heading: "Steps", body: "1. Classify the requirement and its source. 2. Draft acceptance criteria. 3. Identify affected systems. 4. Attach the spec to a work order." },
      { heading: "Definition of Ready", body: "A spec is ready when acceptance criteria, affected repos, and test expectations are all defined." },
    ],
  },
  {
    slug: "blueprint-review",
    title: "Blueprint Review",
    category: "Architecture",
    owner: "Orion",
    updated: "1 week ago",
    summary: "The structure for reviewing an architecture blueprint before build.",
    sections: [
      { heading: "Scope", body: "Confirm the blueprint covers data model, interfaces, and failure modes." },
      { heading: "Risk", body: "Flag high-risk components and require a rollback plan for each." },
      { heading: "Approval", body: "Two-agent sign-off required before any work order enters Build." },
    ],
  },
  {
    slug: "work-order-execution",
    title: "Work Order Execution",
    category: "Build",
    owner: "Atlas",
    updated: "3 days ago",
    summary: "How an agent picks up, builds, and ships a work order.",
    sections: [
      { heading: "Pick up", body: "Claim the highest-priority unblocked work order from the queue." },
      { heading: "Build", body: "Implement against the spec, write tests, and keep the diff focused." },
      { heading: "Ship", body: "Open a PR, pass review, and merge once tests are green." },
    ],
  },
  {
    slug: "test-and-coverage",
    title: "Test & Coverage Standards",
    category: "Quality",
    owner: "Vega",
    updated: "5 days ago",
    summary: "Required test types and coverage thresholds for every change.",
    sections: [
      { heading: "Required Tests", body: "Unit for logic, integration for endpoints, and e2e for critical flows." },
      { heading: "Thresholds", body: "Block merge below 80% coverage on changed lines." },
    ],
  },
  {
    slug: "release-and-rollback",
    title: "Release & Rollback",
    category: "Operations",
    owner: "Echo",
    updated: "2 weeks ago",
    summary: "How to ship a release safely and revert without downtime.",
    sections: [
      { heading: "Release", body: "Deploy behind a flag, run smoke tests, then ramp traffic." },
      { heading: "Rollback", body: "Every release must have a one-command rollback verified in staging." },
    ],
  },
  {
    slug: "incident-response",
    title: "Incident Response",
    category: "Operations",
    owner: "Vega",
    updated: "1 month ago",
    summary: "The first 30 minutes of a production incident.",
    sections: [
      { heading: "Detect", body: "Acknowledge the alert and declare a severity within 5 minutes." },
      { heading: "Mitigate", body: "Roll back or flag-off the offending change, then open a postmortem." },
    ],
  },
  {
    slug: "agent-calibration",
    title: "Agent Calibration",
    category: "Operations",
    owner: "Orion",
    updated: "3 weeks ago",
    summary: "How recurring review feedback is turned into agent guardrails.",
    sections: [
      { heading: "Collect", body: "Aggregate review comments and failed checks per agent each week." },
      { heading: "Apply", body: "Promote repeated feedback into the agent's standing instructions." },
    ],
  },
]

export function getPlaybook(slug: string): Playbook | undefined {
  return playbooks.find((playbook) => playbook.slug === slug)
}
