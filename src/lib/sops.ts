export type SopSection = {
  heading: string
  body: string
}

export type Sop = {
  slug: string
  title: string
  category: string
  owner: string
  updated: string
  summary: string
  sections: SopSection[]
}

export const sops: Sop[] = [
  {
    slug: "inbound-lead-response-playbook",
    title: "Inbound Lead Response Playbook",
    category: "Sales",
    owner: "Priya Nair",
    updated: "2 days ago",
    summary:
      "How to respond to inbound leads within the 10-minute SLA and book the first call.",
    sections: [
      { heading: "Goal", body: "Contact every inbound lead within 10 minutes and book a qualified call." },
      { heading: "Steps", body: "1. Claim the lead in the CRM. 2. Call immediately. 3. If no answer, send the Day 1 text and email. 4. Log the outcome and set the next follow-up." },
      { heading: "SLA", body: "First contact attempt must occur within 10 minutes during business hours." },
    ],
  },
  {
    slug: "discovery-call-framework",
    title: "Discovery Call Framework",
    category: "Sales",
    owner: "Sarah Chen",
    updated: "1 week ago",
    summary: "The structure for a high-quality discovery call that surfaces pain and budget.",
    sections: [
      { heading: "Open", body: "Set the agenda and confirm time available." },
      { heading: "Discover", body: "Uncover current state, desired state, and the cost of inaction." },
      { heading: "Qualify", body: "Confirm budget, authority, need, and timeline before proposing next steps." },
    ],
  },
  {
    slug: "objection-handling-guide",
    title: "Objection Handling Guide",
    category: "Coaching",
    owner: "Marcus Webb",
    updated: "3 days ago",
    summary: "A repeatable loop for handling objections without being pushy.",
    sections: [
      { heading: "Acknowledge", body: "Validate the concern so the prospect feels heard." },
      { heading: "Explore", body: "Ask a question to understand the real objection behind the stated one." },
      { heading: "Respond", body: "Address the root concern and confirm it's resolved before moving on." },
    ],
  },
  {
    slug: "crm-hygiene-standards",
    title: "CRM Hygiene Standards",
    category: "RevOps",
    owner: "Jordan Lee",
    updated: "5 days ago",
    summary: "Required fields and update cadence to keep pipeline data trustworthy.",
    sections: [
      { heading: "Required Fields", body: "Outcome, notes, next step, follow-up date, and objections on every opportunity." },
      { heading: "Cadence", body: "Update the CRM immediately after every call or meeting." },
    ],
  },
  {
    slug: "proposal-and-contract-process",
    title: "Proposal & Contract Process",
    category: "Sales",
    owner: "Diego Ramos",
    updated: "2 weeks ago",
    summary: "From verbal yes to signed contract without losing momentum.",
    sections: [
      { heading: "Proposal", body: "Send the proposal within 24 hours of the close call." },
      { heading: "Follow-Up", body: "Confirm receipt, schedule a review, and set a decision date." },
    ],
  },
  {
    slug: "onboarding-new-reps",
    title: "Onboarding New Reps",
    category: "Operations",
    owner: "Tyler Brooks",
    updated: "1 month ago",
    summary: "The first 30 days for a new closer or setter.",
    sections: [
      { heading: "Week 1", body: "Product, offer, and CRM training. Shadow live calls." },
      { heading: "Weeks 2–4", body: "Ramp on live leads with daily coaching reviews." },
    ],
  },
  {
    slug: "refund-and-dispute-sop",
    title: "Refund & Dispute SOP",
    category: "Operations",
    owner: "Jordan Lee",
    updated: "3 weeks ago",
    summary: "How to handle refund requests and payment disputes consistently.",
    sections: [
      { heading: "Intake", body: "Log the request, reason, and amount within the same day." },
      { heading: "Resolution", body: "Escalate to finance, document the decision, and follow up with the customer." },
    ],
  },
]

export function getSop(slug: string): Sop | undefined {
  return sops.find((sop) => sop.slug === slug)
}
